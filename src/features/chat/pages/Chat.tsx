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

/* ---------- 主组件 ---------- */

export default function Chat() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  const DEFAULT_AVATAR = '/userlogo.ico';
  const navigate = useNavigate();
  //接管用户更新头像的弹窗
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  /* ---------- 获取用户信息（权威逻辑） ---------- */

  function fetchUserInfo() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // 🔹 token 里的用户名作为备用
    const payload = parseJwt(token);
    const fallbackNickname = payload?.username ?? '星洲用户';

    apiRequest(API.user.info)
      .then((res) => {
        if (!res.ok) throw new Error('fetch user info failed');
        return res.json();
      })
      .then((data) => {
        setUser({
          nickname: data.userName || fallbackNickname,
          avatar: data.avatarUrl ? `${data.avatarUrl}?t=${Date.now()}` : DEFAULT_AVATAR,
        });
      })
      .catch(() => {
        // ❗ 接口失败才整体回退
        setUser({
          nickname: fallbackNickname,
          avatar: DEFAULT_AVATAR,
        });
      });
  }

  /* ---------- 页面初始化 ---------- */

  useEffect(() => {
    fetchUserInfo();
  }, []);

  /* ---------- 新对话 ---------- */

  function handleNewChat() {
    setResetKey((k) => k + 1);
  }

  return (
    <HomeBackground>
      <div className="h-screen flex flex-col">
        <TopNav
          user={user}
          onNewChat={handleNewChat}
          onLogout={() => setShowLogoutModal(true)}
          onEditAvatar={() => setShowAvatarEditor(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* 桌面显示，手机隐藏 */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <main className="flex-1 flex justify-center overflow-hidden">
            <div
              className="
              w-full
              max-w-[1100px]
              h-full
              px-3 md:px-6
              py-4 md:py-8
              animate-fade-in
             "
            >
              <ChatWindow key={resetKey} userAvatar={user?.avatar} userId={user?.nickname} />
            </div>
          </main>
        </div>

        {/* 退出登录 */}
        <LogoutConfirmModal
          open={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            localStorage.removeItem('auth_token');
            setUser(null);
            setShowLogoutModal(false);
            navigate('/login');
          }}
        />

        {/* 修改头像 */}
        <AvatarEditorModal
          open={showAvatarEditor}
          currentAvatar={user?.avatar || DEFAULT_AVATAR}
          onClose={() => setShowAvatarEditor(false)}
          onSuccess={() => {
            fetchUserInfo(); // 头像立即刷新
            setShowSuccessToast(true); // ⭐ 显示成功提示

            setTimeout(() => {
              setShowSuccessToast(false);
            }, 1800);
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
