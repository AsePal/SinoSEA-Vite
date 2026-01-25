import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import Chat from './pages/Chat';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './TermsofUse/TermsOfUse';
import ComplaintPage from './pages/ComplaintPage';
import AboutUsPage from './pages/AboutUs';

import AuthLayout from './layouts/AuthLayout';

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
      <Route path="/about" element={<AboutUsPage />} />
    </Routes>
  );
}
