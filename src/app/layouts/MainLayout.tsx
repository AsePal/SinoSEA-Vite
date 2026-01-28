import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { UserInfo } from '../../shared/types/user.types';

import TopNav from '../../features/chat/components/TopNav';
import Sidebar from '../../features/chat/components/Sidebar';
import { LogoutConfirmModal, AvatarEditorModal, SuccessToastModal } from '../../shared/components';
import { HomeBackground } from '../../features/landing';

import API, { apiRequest } from '../../shared/api/config';
import { parseJwt } from '../../shared/utils/jwt';

export default function MainLayout() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();

  function fetchUserInfo() {
    const token = localStorage.getItem('auth_token');

    // 未登录：保持匿名语义（user === null）
    if (!token) {
      setUser(null);
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
          nickname: data.userName || fallbackNickname,
          avatar: data.avatarUrl ? `${data.avatarUrl}?t=${Date.now()}` : DEFAULT_AVATAR,
        });
      })
      .catch(() => {
        setUser(null);
      });
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <HomeBackground>
      <div className="h-screen flex flex-col animate-fade-in">
        <TopNav
          user={user}
          onLogout={() => setShowLogoutModal(true)}
          onEditAvatar={() => setShowAvatarEditor(true)}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* 遮罩 */}
          <div
            className={`
              fixed top-[70px] left-0 right-0 bottom-0 z-40
              bg-black/20 transition-opacity duration-300
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`
              fixed top-[70px] left-0 bottom-0 z-50
              transition-transform duration-300 ease-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-[260px]'}
            `}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* 页面内容：通过 Outlet 渲染 /chat 下的页面 */}
          <main className="flex-1 flex overflow-hidden">
            <div className="w-full h-full flex">
              <Outlet context={{ user, refreshUser: fetchUserInfo }} />
            </div>
          </main>
        </div>

        {/* 退出 */}
        <LogoutConfirmModal
          open={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            localStorage.removeItem('auth_token');
            setUser(null);
            navigate('/login');
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
      </div>
    </HomeBackground>
  );
}
