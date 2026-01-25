import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import API from '../utils/apiConfig';
import SuccessToastModal from '../components/SuccessToastModal';


type VerifyMethod = 'phone' | 'email';

export default function ForgotPassword() {
  const navigate = useNavigate();

  /** 阶段控制 */
  const [method, setMethod] = useState<VerifyMethod | ''>('');
  const [identifier, setIdentifier] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  /** 表单数据 */
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /** 状态 */
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /** 倒计时 */
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /** 发送验证码 */
  const handleSendCode = async () => {
    if (!method) {
      setError('请选择验证方式');
      return;
    }
    if (!identifier) {
      setError('请输入邮箱或手机号');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const body =
        method === 'email'
          ? { email: identifier }
          : { phone: identifier };

      const res = await fetch(API.auth.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('验证码发送失败');
      }

      // 后端即使用户不存在也返回成功
      setCodeSent(true);
      setCountdown(60);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 1800);
    } catch (e: any) {
      setError(e.message || '发送失败');
    } finally {
      setLoading(false);
    }
  };

  /** 重置密码 */
  const handleResetPassword = async () => {
    if (!verificationCode || !newPassword || !confirmPassword) {
      setError('请填写完整信息');
      return;
    }

    if (newPassword.length < 8) {
      setError('密码长度不能少于 8 位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(API.auth.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          verificationCode,
          newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '重置失败');
      }

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e: any) {
      setError(e.message || '重置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover"
      style={{ backgroundImage: 'url("/images/login-bg.avif")' }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          忘记密码
        </h2>
        <p className="text-gray-500 mb-6">
          通过验证码重置密码
        </p>

        {/* 选择方式 */}
        <select
          className="w-full mb-3 px-4 py-3 border rounded-lg"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value as VerifyMethod);
            setIdentifier('');
            setCodeSent(false);
          }}
        >
          <option value="" disabled >请选择验证方式</option>
          <option value="phone">手机号</option>
          <option value="email">邮箱</option>
        </select>

        {/* 输入邮箱/手机号 */}
        <input
          disabled={!method}
          className="w-full mb-3 px-4 py-3 border rounded-lg disabled:bg-gray-100"
          placeholder={method === 'email' ? '请输入邮箱' : '请输入手机号'}
          value={identifier}
          onChange={(e) => setIdentifier(e.currentTarget.value.replace(/\s/g, ''))}
        />

        {/* 验证码 */}
        <div className="flex gap-3 mb-3">
          <input
            disabled={!codeSent}
            className="flex-1 px-4 py-3 border rounded-lg disabled:bg-gray-100"
            placeholder="6 位验证码"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value.replace(/\s/g, ''))}
          />
          <button
            type="button"
            disabled={!identifier || countdown > 0}
            onClick={handleSendCode}
            className={`px-4 rounded-lg text-sm ${
              countdown > 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {countdown > 0 ? `${countdown}s` : '发送验证码'}
          </button>
        </div>

        {/* 新密码 */}
        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-3 px-4 py-3 border rounded-lg disabled:bg-gray-100"
          placeholder="新密码（不少于 8 位）"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-4 px-4 py-3 border rounded-lg disabled:bg-gray-100"
          placeholder="确认新密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        {error && (
          <div className="text-red-500 text-sm mb-3">
            {error}
          </div>
        )}

        <button
          onClick={handleResetPassword}
          disabled={!codeSent || loading}
          className="
            w-full flex items-center justify-center gap-2
            rounded-xl py-4 text-lg font-semibold
            bg-blue-500 text-white hover:bg-blue-600
            transition disabled:bg-gray-300
          "
        >
          <PaperAirplaneIcon className="w-6 h-6" />
          {loading ? '提交中...' : '重置密码'}
        </button>

        <div className="mt-4 text-sm text-center text-gray-600">
          想起密码了？
          <Link to="/login" className="text-blue-600 ml-1">
            返回登录
          </Link>
        </div>
      </div>

      {/* 验证码已发送 */}
      <SuccessToastModal
        open={showToast}
        title="验证码已发送"
        description="有效期为 5 分钟"
      />

      {/* 重置成功 */}
      <SuccessToastModal
        open={showSuccess}
        title="密码重置成功"
        description="请使用新密码登录"
      />
    </div>
  );
}
