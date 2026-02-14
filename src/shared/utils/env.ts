export const isDev = import.meta.env.DEV;
// 后端基地址：兼容两种变量名，优先显式 URL 变量
export const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE;
