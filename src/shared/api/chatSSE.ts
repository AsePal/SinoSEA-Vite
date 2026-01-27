import type { SSEEvent } from '../../features/chat/types/chat.types';
import API from './config';

export type SendChatSSEOptions = {
  /**
   * UI/调用方传入的取消信号（例如：组件卸载、用户点“停止生成”）
   */
  signal?: AbortSignal;

  /**
   * 首次收到任何字节的超时（默认 15s）
   * 典型覆盖：网络断联/代理卡住/后端没响应
   */
  firstByteTimeoutMs?: number;

  /**
   * 流在“持续无数据”的空闲超时（默认 30s）
   * 典型覆盖：SSE 半断开、代理吞包、后端挂起不再推送
   */
  idleTimeoutMs?: number;

  /**
   * 整个请求的最大总时长（默认 2min）
   * 典型覆盖：某些极端情况下永不结束的连接
   */
  totalTimeoutMs?: number;
};

export class SSEError extends Error {
  code:
    | 'HTTP_ERROR'
    | 'NO_BODY'
    | 'FIRST_BYTE_TIMEOUT'
    | 'IDLE_TIMEOUT'
    | 'TOTAL_TIMEOUT'
    | 'ABORTED'
    | 'PARSE_ERROR'
    | 'NETWORK_ERROR';

  status?: number;

  constructor(
    code: SSEError['code'],
    message: string,
    extra?: { status?: number; cause?: unknown },
  ) {
    super(message);
    this.name = 'SSEError';
    this.code = code;
    this.status = extra?.status;
    // 兼容 TS/JS 的 error cause（不强依赖运行时支持）
    (this as any).cause = extra?.cause;
  }
}

export async function sendChatSSE(
  payload: {
    message: string;
    conversationId?: string;
    userId?: string;
  },
  onEvent: (event: SSEEvent) => void,
  options: SendChatSSEOptions = {},
) {
  const {
    signal,
    firstByteTimeoutMs = 15000,
    idleTimeoutMs = 30000,
    totalTimeoutMs = 120000,
  } = options;

  // 内部 controller，用于超时/内部取消
  const controller = new AbortController();

  // 外部取消 → 透传到内部
  const onAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }

  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

  // 活跃时间：收到任何字节就刷新
  let lastActivity = Date.now();
  let gotFirstByte = false;

  // --- 定时器：首包、空闲、总时长 ---
  const firstByteTimer = setTimeout(() => {
    if (!gotFirstByte) controller.abort();
  }, firstByteTimeoutMs);

  const idleChecker = setInterval(() => {
    if (Date.now() - lastActivity > idleTimeoutMs) {
      controller.abort();
    }
  }, 2000);

  const totalTimer = setTimeout(() => {
    controller.abort();
  }, totalTimeoutMs);

  const cleanup = async () => {
    clearTimeout(firstByteTimer);
    clearTimeout(totalTimer);
    clearInterval(idleChecker);
    if (signal) signal.removeEventListener('abort', onAbort);

    try {
      await reader?.cancel();
    } catch {
      // ignore
    }
  };

  try {
    const res = await fetch(API.chat.stream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new SSEError('HTTP_ERROR', `SSE request failed: ${res.status}`, {
        status: res.status,
      });
    }

    if (!res.body) {
      throw new SSEError('NO_BODY', 'SSE response has no body');
    }

    reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (!value || value.length === 0) continue;

      // 任何字节 = 活跃
      gotFirstByte = true;
      lastActivity = Date.now();

      buffer += decoder.decode(value, { stream: true });

      /**
       * SSE 事件以空行分隔（\n\n 或 \r\n\r\n）
       */
      const chunks = buffer.split(/\r?\n\r?\n/);
      buffer = chunks.pop() ?? '';

      for (const chunk of chunks) {
        const lines = chunk.split(/\r?\n/);

        // 允许多行 data:，需要拼起来
        const dataLines: string[] = [];
        for (const raw of lines) {
          const line = raw.trimEnd();

          // 注释/心跳（:xxx）忽略
          if (line.startsWith(':') || line.length === 0) continue;

          if (line.startsWith('data:')) {
            dataLines.push(line.replace(/^data:\s?/, ''));
          }
        }

        if (dataLines.length === 0) continue;

        const jsonText = dataLines.join('\n');

        let event: SSEEvent;
        try {
          event = JSON.parse(jsonText) as SSEEvent;
        } catch (e) {
          throw new SSEError('PARSE_ERROR', 'Failed to parse SSE event JSON', { cause: e });
        }

        onEvent(event);

        // end = 正常结束：直接 return
        if ((event as any).type === 'end') {
          return;
        }
      }
    }

    /**
     * 走到这里表示：流“自然结束”但没收到 end。
     * 这在网络抖动/代理截断时很常见。我们把它当成错误，让 UI 解除卡死并可重试。
     */
    throw new SSEError('NETWORK_ERROR', 'SSE stream closed before receiving end');
  } catch (e: any) {
    // Abort 细分：是外部取消？还是超时？
    if (e?.name === 'AbortError' || controller.signal.aborted) {
      // 首包没到
      if (!gotFirstByte) {
        throw new SSEError(
          'FIRST_BYTE_TIMEOUT',
          `No response within ${firstByteTimeoutMs}ms (first byte timeout)`,
          { cause: e },
        );
      }

      // 总时长超时（优先判断）
      //（这里用“已收到首包 + 已 abort + 超过 totalTimeoutMs 可能性”推断）
      // 更严谨可以用标志位记录是谁触发 abort，但这已经足够解决“卡死”。
      // 空闲超时
      if (Date.now() - lastActivity > idleTimeoutMs) {
        throw new SSEError('IDLE_TIMEOUT', `No SSE data for ${idleTimeoutMs}ms (idle timeout)`, {
          cause: e,
        });
      }

      // 大概率是外部取消 or 总时长
      throw new SSEError('ABORTED', 'SSE aborted', { cause: e });
    }

    // 其他网络/运行时错误
    if (e instanceof SSEError) throw e;
    throw new SSEError('NETWORK_ERROR', 'SSE request failed', { cause: e });
  } finally {
    await cleanup();
  }
}
