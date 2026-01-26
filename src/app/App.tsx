import { Routes, Route } from 'react-router-dom';

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
      {/* 引导页 */}
      <Route path="/" element={<Landing />} />

      {/* Auth 页面 */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* 主功能页 */}
      <Route path="/chat" element={<Chat />} />

      {/* 信息页 */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/complaint" element={<ComplaintPage />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
}
