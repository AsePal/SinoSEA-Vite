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
