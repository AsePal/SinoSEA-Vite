import { API_BASE } from './env';

const BASE = API_BASE ?? 'http://192.168.10.164:3000';
const TOKEN_KEY = 'auth_token';


type Endpoints = {
  base: string;
  auth: {
    login: string;
    register: string;
    logout: string;
    me: string;
    qqMe: string;
  };
  user: {
    profile: string;
    update: string;
  };
  complaint: {
    submit: string;
    list: string;
  };
  chat: {
    send: string;
    history: string;
  };
};

export const API: Endpoints = {
  base: BASE,
  auth: {
    //登录接口
    login: `${BASE}/auth/login`,
    //注册接口
    register: `${BASE}/auth/register`,
    //退出接口
    logout: `${BASE}/auth/logout`,
    //弃用
    me: `${BASE}/auth/me`,
    //弃用
    qqMe: `${BASE}/auth/qq/me`,
  },
  user: {
    //
    profile: `${BASE}/user/profile`,
    //用户信息更新
    update: `${BASE}/user/update`,
  },
  complaint: {
    //
    submit: `${BASE}/complaint/submit`,
    //
    list: `${BASE}/complaint/list`,
  },
  chat: {
    //聊天信息接口
    send: `${BASE}/chat/send`,
    //
    history: `${BASE}/chat/history`,
  },
  
};

export function withParam(url: string, params: Record<string, string | number>) {
  let result = url;
  Object.keys(params).forEach((key) => {
    result = result.replace(new RegExp(`:${key}`, 'g'), String(params[key]));
  });
  return result;
}

export default API;

export async function apiRequest(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
  } = {}
) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // token 失效统一处理
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  }

  return res;
}

