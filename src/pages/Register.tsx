import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const MOCK_SMS_CODE = '114514';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleRegister = async () => {
    if (!agreed) return setError('请同意相关条款');
    if (!name || !phone || !smsCode || !password || !confirmPassword)
      return setError('请填写完整信息');
    if (password.length < 8) return setError('密码不少于 8 位');
    if (password !== confirmPassword)
      return setError('两次密码不一致');
    if (smsCode !== MOCK_SMS_CODE) return setError('验证码错误');

    setLoading(true);
    setError('');

    try {
      const res = await fetch(API.auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, phone, password }),
      });
      if (!res.ok) throw new Error('注册失败');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (e: any) {
      setError(e.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="min-h-[620px] rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)] px-14 py-16 text-white">
        <h1 className="text-3xl font-semibold mb-2 text-center">用户注册</h1>
        <p className="text-white/70 mb-10 text-center">
          使用手机号完成注册
        </p>

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder="昵称 / 名称"
          value={name}
          onChange={(e) => setName(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder="手机号"
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <div className="flex gap-3 mb-4">
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
            placeholder="短信验证码"
            value={smsCode}
            onChange={(e) =>
              setSmsCode(e.currentTarget.value.replace(/\s/g, ''))
            }
          />
          <button
            disabled={countdown > 0}
            onClick={() => setCountdown(60)}
            className={`px-4 rounded-xl ${
              countdown > 0
                ? 'bg-white/30'
                : 'bg-indigo-500 hover:bg-indigo-400'
            }`}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </button>
        </div>

        <input
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder="密码"
          value={password}
          onChange={(e) =>
            setPassword(e.currentTarget.value.replace(/\s/g, ''))
          }
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder="确认密码"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))
          }
        />

        {error && <div className="text-red-300 text-sm mb-4">{error}</div>}

        <button
          onClick={handleRegister}
          disabled={loading || !agreed}
          className="w-full h-14 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition"
        >
          {loading ? '注册中…' : '完成注册'}
        </button>

        <label className="mt-5 flex items-start gap-2 text-xs text-white/70">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          我已阅读并同意相关条款
        </label>

        <div className="mt-6 text-center text-sm text-white/70">
          已有账号？<Link to="/login">去登录</Link>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl px-8 py-10 text-white text-center">
            <h2 className="text-xl font-semibold mb-2">注册成功</h2>
            <p className="text-white/80 mb-6">即将跳转登录</p>
            <PaperAirplaneIcon className="w-10 h-10 mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
