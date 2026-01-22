import { API_BASE } from './env';

const BASE = API_BASE ?? 'http://192.168.10.2:3000';

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
    login: `${BASE}/auth/login`,
    register: `${BASE}/auth/register`,
    logout: `${BASE}/auth/logout`,
    me: `${BASE}/auth/me`,
    qqMe: `${BASE}/auth/qq/me`,
  },
  user: {
    profile: `${BASE}/user/profile`,
    update: `${BASE}/user/update`,
  },
  complaint: {
    submit: `${BASE}/complaint/submit`,
    list: `${BASE}/complaint/list`,
  },
  chat: {
    send: `${BASE}/chat/send`,
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
