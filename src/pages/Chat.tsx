import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserInfo } from '../types/user';


import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import HomeBackground from '../Background/HomeBackground';

import API, { apiRequest } from '../utils/apiConfig';
import { parseJwt } from '../utils/jwt';

// src/types/chat.ts

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  messageId?: string; // ⭐ 为 SSE 准备
};

/* ---------- SSE 事件类型 ---------- */

export type SSEStartEvent = {
  type: 'start';
  conversationId: string;
  messageId: string;
};

export type SSEDletaEvent = {
  type: 'delta';
  text: string;
};

export type SSEEndEvent = {
  type: 'end';
  conversationId: string;
  messageId: string;
  usage?: {
    total_tokens: number;
  };
};

export type SSEEvent = SSEStartEvent | SSEDletaEvent | SSEEndEvent;




export default function Chat() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const DEFAULT_AVATAR = '/userlogo.ico';
  const [conversationId, setConversationId] = useState<string | undefined>();



  const navigate = useNavigate();

  // ✅ 用户初始化逻辑（必须在组件内部）
  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    // ❗ 没有 token，直接回登录页
    if (!token) {
      navigate('/login');
      return;
    }

    // 1️⃣ 从 JWT 解析昵称
    const payload = parseJwt(token);
    const nickname = payload?.username ?? '星洲用户';

    // 2️⃣ 请求 user/info 拿头像
    apiRequest(API.user.profile)
      .then((res) => {
        if (!res.ok) throw new Error('failed to fetch user info');
        return res.json();
      })
      .then((data) => {
        setUser({
          nickname,
          avatar: data.avatar || DEFAULT_AVATAR,
        });
      })
      .catch(() => {
        // 未获取到信息则使用本地的头像
        setUser({
          nickname,
          avatar: '/userlogo.ico'
        })
      });
  }, [navigate]);


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
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex justify-center overflow-hidden">
            <div className="w-full max-w-[1100px] h-full px-6 py-8">
              <ChatWindow
                key={resetKey}
                userAvatar={user?.avatar}
                userId={user?.nickname}
              />
            </div>
          </main>
        </div>

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
      </div>
    </HomeBackground>
  );
}
