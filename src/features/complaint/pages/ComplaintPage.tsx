import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ComplaintTopNav from '../components/ComplaintTopNav';
import ComplaintHeader from '../components/ComplaintHeader';
import ComplaintForm from '../components/ComplaintForm';
import { LogoutConfirmModal } from '../../../shared/components';
import LoginErrorModal from '../../auth/components/LoginErrorModal';

import type { UserInfo } from '../../../shared/types/user.types';

type LayoutContext = {
  user: UserInfo | null;
  refreshUser: () => void;
};

export default function ComplaintPage() {
  const navigate = useNavigate();
  const { user } = useOutletContext<LayoutContext>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token || !user) {
      setShowLoginRequiredModal(true);
    }
  }, [user]);

  return (
    <>
      {!showLoginRequiredModal ? (
        <>
          <ComplaintTopNav
            user={user}
            onBackHome={() => navigate('/chat')}
            onLogout={() => setShowLogoutModal(true)}
          />

          <main className="px-6 py-10 flex justify-center h-[calc(100vh-64px)] overflow-y-auto chat-scroll">
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
              navigate('/chat');
            }}
          />
        </>
      ) : null}

      <LoginErrorModal
        open={showLoginRequiredModal}
        onConfirm={() => {
          navigate('/login');
        }}
        onCancel={() => {
          setShowLoginRequiredModal(false);
          navigate('/chat');
        }}
      />
    </>
  );
}
