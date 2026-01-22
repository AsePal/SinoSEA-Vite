import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ComplaintTopNav from '../ComplaintPage/ComplaintTopNav';
import ComplaintHeader from '../ComplaintPage/ComplaintHeader';
import ComplaintForm from '../ComplaintPage/ComplaintForm';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import HomeBackground from '../Background/HomeBackground';

import API, { apiRequest } from '../utils/apiConfig';
import { parseJwt } from '../utils/jwt';
import type { UserInfo } from '../types/user';

type Props = {
  user: UserInfo | null;
  onBackHome: () => void;
  onLogout: () => void;
};



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

    // 昵称来自 JWT
    const payload = parseJwt(token);
    const nickname = payload?.username ?? '星洲用户';

    // 头像来自 user/info
    apiRequest(API.user.profile)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser({
          nickname,
          avatar: data.avatar || '/userlogo.ico',
        });
      })
      .catch(() => {
        // user/info 失败不等于未登录
        setUser({
          nickname,
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
