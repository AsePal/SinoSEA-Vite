import { Routes, Route, Navigate } from 'react-router-dom';

import { Landing } from '../features/landing';
import { Login, Register, ForgotPassword, AuthLayout } from '../features/auth';
import { Chat } from '../features/chat';
import { PrivacyPolicy } from '../features/privacy';
import { TermsOfUse } from '../features/terms';
import { ComplaintPage } from '../features/complaint';
import { AboutUs } from '../features/about';

import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />

      {/* 认证页面，使用 AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* 所有其他页面都使用 MainLayout，显示顶栏和侧栏 */}
      <Route element={<MainLayout />}>
        <Route path="/landing" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/complaint" element={<ComplaintPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/about" element={<AboutUs />} />
      </Route>

      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
