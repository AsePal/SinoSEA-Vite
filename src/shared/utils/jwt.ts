// src/utils/jwt.ts

export function parseJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // 1️⃣ 先 base64 解码成「字节字符串」
    const binary = atob(base64);

    // 2️⃣ 把「字节字符串」转成 Uint8Array
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

    // 3️⃣ 按 UTF-8 解码成真正的字符串
    const json = new TextDecoder('utf-8').decode(bytes);

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * 判断 JWT token 是否已过期
 * 基于 token payload 中的 `exp`（秒级时间戳）进行判断
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // exp 是秒级时间戳，Date.now() 是毫秒
  return Date.now() >= payload.exp * 1000;
}
