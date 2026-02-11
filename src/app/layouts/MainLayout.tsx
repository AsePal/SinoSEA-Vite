import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { UserInfo } from '../../shared/types/user.types';

import TopNav from '../../features/chat/components/TopNav';
import Sidebar from '../../features/chat/components/Sidebar';
import {
  LogoutConfirmModal,
  AvatarEditorModal,
  SuccessToastModal,
  UserInfoModal,
} from '../../shared/components';

import API, { apiRequest } from '../../shared/api/config';
import { parseJwt } from '../../shared/utils/jwt';

export default function MainLayout() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [restoreUserInfoOnCancel, setRestoreUserInfoOnCancel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();

  function fetchUserInfo() {
    const token = localStorage.getItem('auth_token');

    // 未登录：保持匿名语义（user === null）
    if (!token) {
      setUser(null);
      setUserLoaded(true);
      return;
    }

    const payload = parseJwt(token);
    const fallbackNickname = payload?.username ?? '需要登录';

    apiRequest(API.user.info)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser({
          nickname: data.userName || data.username || fallbackNickname,
          avatar: data.avatarUrl ? `${data.avatarUrl}?t=${Date.now()}` : DEFAULT_AVATAR,
          phone: data.phone ?? null,
        });
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setUserLoaded(true);
      });
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const openUserInfo = () => {
    setShowUserInfoModal(true);
  };

  const closeUserInfo = () => {
    setShowUserInfoModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* 顶栏 - 所有页面都显示 */}
      <TopNav
        user={user}
        onLogout={() => setShowLogoutModal(true)}
        onEditAvatar={() => setShowAvatarEditor(true)}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* 侧栏 - 所有页面都显示 */}
        {/* 遮罩 */}
        <div
          className={`
              fixed top-14 left-0 right-0 bottom-0 z-40
              bg-black/20 transition-opacity duration-300
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`
              fixed top-14 left-0 bottom-0 z-50
              transition-transform duration-300 ease-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-[260px]'}
            `}
        >
          <Sidebar
            user={user}
            onClose={() => setSidebarOpen(false)}
            onOpenUserInfo={openUserInfo}
          />
        </div>

        {/* 页面内容：通过 Outlet 渲染子路由 */}
        <main
          id="app-scroll-container"
          className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden"
        >
          <Outlet context={{ user, userLoaded, refreshUser: fetchUserInfo }} />
        </main>
      </div>

      {/* 退出 */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => {
          setShowLogoutModal(false);
          if (restoreUserInfoOnCancel) {
            setShowUserInfoModal(true);
            setRestoreUserInfoOnCancel(false);
          }
        }}
        onConfirm={() => {
          localStorage.removeItem('auth_token');
          setUser(null);
          setShowLogoutModal(false);
          setRestoreUserInfoOnCancel(false);
          navigate('/chat');
        }}
      />

      {/* 修改头像 */}
      <AvatarEditorModal
        open={showAvatarEditor}
        currentAvatar={user?.avatar || DEFAULT_AVATAR}
        onClose={() => setShowAvatarEditor(false)}
        onSuccess={() => {
          fetchUserInfo();
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 1800);
        }}
      />

      <SuccessToastModal
        open={showSuccessToast}
        title="头像更新成功"
        description="你的新头像已生效"
      />

      <UserInfoModal
        open={showUserInfoModal}
        user={user}
        onClose={closeUserInfo}
        onEditAvatar={() => setShowAvatarEditor(true)}
        onLogout={() => {
          closeUserInfo();
          setRestoreUserInfoOnCancel(true);
          setShowLogoutModal(true);
        }}
      />
    </div>
  );
}
