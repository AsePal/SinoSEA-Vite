import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDev } from '../utils/env';
import API from '../utils/apiConfig';

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isDev) return; // dev 模式直接放行

    const checkAuth = async () => {
      try {
        const res = await fetch(API.auth.me, {
          credentials: 'include' // 关键：带 Cookie
        });

        if (!res.ok) throw new Error('unauthorized');
      } catch {
        navigate('/login', {
          replace: true,
          state: { message: '请先登录后再访问该页面' }
        });
      }
    };

    checkAuth();
  }, [navigate]);
}
