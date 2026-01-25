import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';
import SuccessToastModal from '../components/SuccessToastModal';

type VerifyMethod = 'phone' | 'email';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [method, setMethod] = useState<VerifyMethod | ''>('');
  const [identifier, setIdentifier] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!method || !identifier) return setError('请填写完整信息');
    setLoading(true);
    setError('');

    try {
      const body =
        method === 'email' ? { email: identifier } : { phone: identifier };

      const res = await fetch(API.auth.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('发送失败');

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

  const handleReset = async () => {
    if (!verificationCode || !newPassword || !confirmPassword)
      return setError('请填写完整信息');
    if (newPassword !== confirmPassword)
      return setError('两次密码不一致');

    setLoading(true);
    setError('');

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

      if (!res.ok) throw new Error('重置失败');

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (e: any) {
      setError(e.message || '重置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="min-h-[620px] rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)] px-14 py-16 text-white">
        <h1 className="text-3xl font-semibold mb-2 text-center">重置密码</h1>
        <p className="text-white/70 mb-10 text-center">
          通过验证码设置新密码
        </p>

        <select
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value as VerifyMethod);
            setIdentifier('');
            setCodeSent(false);
          }}
        >
          <option value="">请选择验证方式</option>
          <option value="phone">手机号</option>
          <option value="email">邮箱</option>
        </select>

        <input
          disabled={!method}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder={method === 'email' ? '请输入邮箱' : '请输入手机号'}
          value={identifier}
          onChange={(e) =>
            setIdentifier(e.currentTarget.value.replace(/\s/g, ''))
          }
        />

        <div className="flex gap-3 mb-4">
          <input
            disabled={!codeSent}
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
            placeholder="验证码"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.currentTarget.value.replace(/\s/g, ''))
            }
          />
          <button
            disabled={!method || !identifier || countdown > 0}
            onClick={handleSendCode}
            className={`px-4 rounded-xl ${
              countdown > 0
                ? 'bg-white/30'
                : 'bg-indigo-500 hover:bg-indigo-400'
            }`}
          >
            {countdown > 0 ? `${countdown}s` : '发送验证码'}
          </button>
        </div>

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder="新密码"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.currentTarget.value.replace(/\s/g, ''))
          }
        />

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder="确认新密码"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))
          }
        />

        {error && <div className="text-red-300 text-sm mb-4">{error}</div>}

        <button
          onClick={handleReset}
          disabled={!codeSent || loading}
          className="w-full h-14 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition"
        >
          {loading ? '提交中…' : '重置密码'}
        </button>

        <div className="mt-8 text-sm text-white/70 text-center">
          <Link to="/login">返回登录</Link>
        </div>
      </div>

      <SuccessToastModal
        open={showToast}
        title="验证码已发送"
        description="有效期为 5 分钟"
      />
      <SuccessToastModal
        open={showSuccess}
        title="密码重置成功"
        description="请使用新密码登录"
      />
    </div>
  );
}
