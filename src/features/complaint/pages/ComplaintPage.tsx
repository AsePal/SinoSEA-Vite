import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ComplaintTopNav from '../components/ComplaintTopNav';
import ComplaintHeader from '../components/ComplaintHeader';
import ComplaintForm from '../components/ComplaintForm';
import { LogoutConfirmModal } from '../../../shared/components';
import { HomeBackground } from '../../landing';

import API, { apiRequest } from '../../../shared/api/config';
import { parseJwt } from '../../../shared/utils/jwt';
import type { UserInfo } from '../../../shared/types/user.types';

export default function ComplaintPage() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    // 第一层：是否登录
    if (!token) {
      navigate('/login');
      return;
    }

    // 先尝试主方案：user/info
    apiRequest(API.user.info)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser({
          nickname: data.username,
          avatar: data.avatarUrl || '/userlogo.ico',
        });
      })
      .catch(() => {
        // 主方案失败 → 启用 JWT 备用方案
        const payload = parseJwt(token);

        setUser({
          nickname: payload?.username ?? '星洲用户',
          avatar: '/userlogo.ico',
        });
      });
  }, [navigate]);

  return (
    <HomeBackground>
      <ComplaintTopNav
        user={user}
        onBackHome={() => navigate('/chat')}
        onLogout={() => setShowLogoutModal(true)}
      />

      <main className="px-6 py-10 flex justify-center">
        <div className="w-full max-w-3xl space-y-10">
          <ComplaintHeader />
          <ComplaintForm />
        </div>
      </main>
      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          // ✅ 正式退出逻辑
          localStorage.removeItem('auth_token');
          navigate('/login');
        }}
      />
    </HomeBackground>
  );
}
