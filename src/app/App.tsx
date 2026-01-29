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

      <Route path="/landing" element={<Landing />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ✅ 使用 MainLayout 的路由 */}
      <Route path="/chat" element={<MainLayout />}>
        <Route index element={<Chat />} />
        <Route path="complaint" element={<ComplaintPage />} />
      </Route>

      {/* ✅ 这些页面保持独立（不复用 MainLayout） */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/about" element={<AboutUs />} />

      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
