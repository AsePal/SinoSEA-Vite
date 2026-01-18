import { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import LoginErrorModal from '../components/LoginErrorModal';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import HomeBackground from '../Background/HomeBackground';

type UserInfo = {
  nickname: string;
  figureurl: string;
};

export default function Chat({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loginError, setLoginError] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [ignoreAuth, setIgnoreAuth] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);

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
      if (hasRetried) {
        setLoginError(true);
      } else {
        setHasRetried(true);
      }
    });
}useEffect(() => {
  fetchUser();
}, [hasRetried]);



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
            userAvatar={user?.figureurl}
            />

          </div>
          
        </main>

      </div>
      
         {/* 🚨 登录异常弹窗（全局） */}
        <LoginErrorModal
          open={loginError}
          onConfirm={()=>{
            //✅ 正式逻辑：跳转登录页
            window.location.href = '/login';
            
          }}
          onCancel={()=>{
            // ⚠️ 开发阶段临时逻辑，后续可删
            setLoginError(false);
          }}
          />
          <LogoutConfirmModal
            open={showLogoutModal}
            onCancel={()=>{
              setShowLogoutModal(false);
            }}
            onConfirm={()=>{
              // ✅ 正式退出逻辑
              // 如果有后端登出接口，可以在这里调用
              // fetch('/auth/logout', { method: 'POST' })          
              
              // 清理本地用户态
              setUser(null);
              // 跳转到登录页
              window.location.href ='/login'
            }}/>
      </div>
    </HomeBackground>
  );
}
