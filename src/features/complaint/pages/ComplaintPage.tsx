import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import ComplaintHeader from '../components/ComplaintHeader';
import ComplaintForm from '../components/ComplaintForm';
import { LogoutConfirmModal } from '../../../shared/components';
import LoginErrorModal from '../../auth/components/LoginErrorModal';

import type { UserInfo } from '../../../shared/types/user.types';

type LayoutContext = {
  user: UserInfo | null;
  userLoaded: boolean;
  refreshUser: () => void;
};

export default function ComplaintPage() {
  const navigate = useNavigate();
  const { user, userLoaded } = useOutletContext<LayoutContext>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!userLoaded) return;
    if (!token || !user) {
      setShowLoginRequiredModal(true);
    }
  }, [user, userLoaded]);

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
    <div className="w-full min-h-full bg-white dark:bg-gray-900">
      {/* 内容区域 */}
      <div className="px-4 md:px-6 py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-2xl space-y-8">
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
