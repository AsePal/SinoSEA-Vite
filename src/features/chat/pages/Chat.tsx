import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '../../../shared/types/user.types';

import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import {
  LogoutConfirmModal,
  AvatarEditorModal,
  SuccessToastModal,
} from '../../../shared/components';
import { HomeBackground } from '../../landing';

import API, { apiRequest } from '../../../shared/api/config';
import { parseJwt } from '../../../shared/utils/jwt';

export default function Chat() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ 你的本地默认头像（public/imges/userlogo.ico）
  const DEFAULT_AVATAR = '/userlogo.ico';

  const navigate = useNavigate();

  function fetchUserInfo() {
    const token = localStorage.getItem('auth_token');

    // ✅ 未登录：保持匿名语义（user === null）
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
        // token 有，但接口失败 → 这里你可以选择降级为“匿名”，避免伪登录菜单
        setUser(null);
        // 如果你更希望显示昵称但不允许菜单，请用 TopNav 的 token 判定来控制菜单渲染
        // setUser({ nickname: fallbackNickname, avatar: DEFAULT_AVATAR });
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
          <div
            className={`
              fixed top-[70px] left-0 right-0 bottom-0 z-40
              bg-black/20 transition-opacity duration-300
              ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={`
            fixed top-[70px] left-0 bottom-0 z-50
            transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-[260px]'}
          `}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          <main className="flex-1 flex overflow-hidden">
            <div className="w-full h-full flex">
              <ChatWindow userAvatar={user?.avatar} userId={user?.nickname} />
            </div>
          </main>
        </div>

        <LogoutConfirmModal
          open={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            localStorage.removeItem('auth_token');
            setUser(null); // ✅ 立刻回到匿名语义
            navigate('/login');
          }}
        />

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
