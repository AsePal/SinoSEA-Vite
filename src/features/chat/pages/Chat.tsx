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

  // ⭐ Sidebar 状态
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();

  /**
   * 获取用户信息
   * 现在支持「匿名态」
   */
  function fetchUserInfo() {
    const token = localStorage.getItem('auth_token');

    // ✅ 第一阶段核心改动：
    // 没有 token = 匿名用户
    // 允许继续渲染 Chat，不做跳转
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
        // token 存在但接口失败 → 降级为“已登录但信息不完整”
        setUser({
          nickname: fallbackNickname,
          avatar: DEFAULT_AVATAR,
        });
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
          {/* Backdrop */}
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
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* 主聊天区 */}
          <main className="flex-1 flex  overflow-hidden">
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
