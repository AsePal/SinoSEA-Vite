import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../../shared/api/config';
import { SuccessToastModal } from '../../../shared/components';


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
  const [showSuccess, setShowSuccess] = useState(false);

  const canSendCode = phone.trim().length > 0 && countdown === 0;

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
      setShowSuccess(true);
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
        <h1 className="text-3xl font-semibold mb-2 text-center">
          用户注册
        </h1>
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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
            placeholder="短信验证码"
            value={smsCode}
            onChange={(e) =>
              setSmsCode(e.currentTarget.value.replace(/\s/g, ''))
            }
          />

          <button
            disabled={!canSendCode}
            onClick={() => setCountdown(60)}
            className={`
            w-full sm:w-auto
            px-4 py-3
            rounded-xl
            whitespace-nowrap
            transition
            ${canSendCode
                ? 'bg-indigo-500 hover:bg-indigo-400'
                : 'bg-white/30 text-white/50 cursor-not-allowed'
              }
          `}
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
      <SuccessToastModal
        open={showSuccess}
        title="注册成功"
        description="即将跳转登录"
      />

    </div>
  );
}
