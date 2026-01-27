import { Routes, Route, Navigate } from 'react-router-dom';

import { Landing } from '../features/landing';
import { Login, Register, ForgotPassword, AuthLayout } from '../features/auth';
import { Chat } from '../features/chat';
import { PrivacyPolicy } from '../features/privacy';
import { TermsOfUse } from '../features/terms';
import { ComplaintPage } from '../features/complaint';
import { AboutUs } from '../features/about';

export default function App() {
  return (
    <Routes>
      {/* ✅ 首次进入：直接进入 Chat */}
      <Route path="/" element={<Navigate to="/chat" replace />} />

      {/* Landing 仍然保留为显式入口 */}
      <Route path="/landing" element={<Landing />} />

      {/* Auth 页面 */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* 主功能页（允许匿名） */}
      <Route path="/chat" element={<Chat />} />

      {/* 信息页 */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/complaint" element={<ComplaintPage />} />
      <Route path="/about" element={<AboutUs />} />

      {/* 🧹 兜底：未知路由也回到 Chat */}
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
