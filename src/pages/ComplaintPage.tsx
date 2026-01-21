import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ComplaintTopNav from '../ComplaintPage/ComplaintTopNav';
import ComplaintHeader from '../ComplaintPage/ComplaintHeader';
import ComplaintForm from '../ComplaintPage/ComplaintForm';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import HomeBackground from '../Background/HomeBackground';

type UserInfo = {
  nickname: string;
  figureurl: string;
};

export default function ComplaintPage() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  

  const [user, setUser] = useState<UserInfo | null>(null);

  // ⚠️【开发阶段使用】失败重试次数，后续可删
  const [retryCount, setRetryCount] = useState(0);

  /** 获取用户信息 */
  function fetchUser() {
    fetch('/auth/qq/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('unauthorized');
        return res.json();
      })
      .then((data) => {
        if (!data?.nickname || !data?.figureurl) {
          throw new Error('invalid user');
        }

        setUser({
          nickname: data.nickname,
          figureurl: data.figureurl,
        });
      })
      .catch(() => {        
      });
  }

  useEffect(() => {
    fetchUser();
  }, []);

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
        window.location.href = '/login';
        }}
    />

    </HomeBackground>
  );
}
