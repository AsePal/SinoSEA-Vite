import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Chat from './pages/Chat';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from "./TermsofUse/TermsOfUse";
import ComplaintPage from './pages/ComplaintPage';
import AboutUsPage from './pages/AboutUs';
import Register from './pages/Register';
import ForgotPassword from'./pages/ForgotPassword'
console.log('🔥 App.tsx 已重新加载');


export default function App() {
  return (
    <Routes>
      {/* 引导页 */}
      <Route path="/" element={<Landing />} />

      {/* 登录页 */}
      <Route path="/login" element={<Login />} />

      {/* 主功能页 */}
      <Route path="/chat" element={<Chat />} />

      {/* 其他信息页 */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/complaint" element={<ComplaintPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/register" element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
    </Routes>
  );
}
