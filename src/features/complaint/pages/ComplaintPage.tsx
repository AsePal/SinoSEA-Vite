import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

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

  if (showLoginRequiredModal) {
    return (
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
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-6 py-10 flex justify-center chat-scroll">
        <div className="w-full max-w-3xl space-y-10">
          <ComplaintHeader />
          <ComplaintForm />
        </div>
      </div>

      {/* 退出登录弹窗 */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          localStorage.removeItem('auth_token');
          navigate('/chat');
        }}
      />
    </div>
  );
}
