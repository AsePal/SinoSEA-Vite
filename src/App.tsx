import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';

export default function App() {
  return (
    <Routes>
      {/* 访问 / 时，重定向到 /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 访问 /login 显示登录页 */}
      <Route path="/login" element={<Login />} />

      {/* 访问 /chat 显示聊天页 */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}
