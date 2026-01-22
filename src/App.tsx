import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from "./TermsofUse/TermsOfUse";
import ComplaintPage from './pages/ComplaintPage';
import AboutUsPage from './pages/AboutUs'
import Register from './pages/Register'




export default function App() {
  return (
    <Routes>
      {/* 访问 / 时，重定向到 /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 访问 /login 显示登录页 */}
      <Route path="/login" element={<Login />} />

      {/* 访问 /chat 显示聊天页 */}
      <Route path="/chat" element={<Chat />} />
      {/*跳转到隐私页*/}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      {/* 跳转到使用条款页*/}
      <Route path="/terms" element={<TermsOfUse />} />
      {/*跳转到投诉反馈页 */}
      <Route path="/complaint" element={<ComplaintPage />} />
      {/*跳转到关于我们 */}
      <Route path="/about" element={<AboutUsPage />} />
      {/*跳转到用户注册页 */}
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
