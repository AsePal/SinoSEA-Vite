import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { apiRequest } from '../utils/apiConfig';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useLocation } from 'react-router-dom';

type LoginAnim = 'idle' | 'success' | 'error';

export default function Login() {
  const navigate = useNavigate();

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [leaving, setLeaving] = useState(false);
  const [loginAnim, setLoginAnim] = useState<LoginAnim>('idle');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);



  /* CapsLock 检测 */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) =>
      setCapsLockOn(e.getModifierState('CapsLock'));

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  /* 记住账号 */
  useEffect(() => {
    const saved = localStorage.getItem('remember_account');
    if (saved) {
      setAccount(saved);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!agreed) return setError('请先阅读并同意相关条款');
    if (!account || !password) return setError('请输入账号和密码');
    if (/\s/.test(account) || /\s/.test(password))
      return setError('账号或密码不能包含空格');

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest(API.auth.login, {
        method: 'POST',
        body: { identifier: account, password },
      });

      if (res.status === 401) throw new Error('用户名或密码错误');
      if (!res.ok) throw new Error('登录失败');

      const data = await res.json();
      localStorage.setItem('auth_token', data.accessToken);

      if (rememberMe) {
        localStorage.setItem('remember_account', account);
      } else {
        localStorage.removeItem('remember_account');
      }

      setLoginAnim('success');
      setLeaving(true);

      setTimeout(() => navigate('/chat'), 350);
    } catch (e: any) {
      setError(e.message || '登录失败');
      setLoginAnim('error');
      setTimeout(() => setLoginAnim('idle'), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div
        className={`
          min-h-[600px]
          rounded-3xl bg-white/20 backdrop-blur-lg
          border border-white/30
          shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          px-14 py-16 text-white
          transition-all duration-400 ease-out
          ${visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'}
        `}
      >
        <h1 className="text-3xl font-semibold mb-2 text-center">欢迎登录</h1>
        <p className="text-white/70 mb-10 text-center">
          校园智能助手服务平台
        </p>

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60"
          placeholder="手机号 / 用户名"
          value={account}
          onChange={(e) => setAccount(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/20 border border-white/30 placeholder-white/60"
            placeholder="密码"
            value={password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChange={(e) =>
              setPassword(e.currentTarget.value.replace(/\s/g, ''))
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
            tabIndex={-1}
          >
            {showPassword ? '🧐' : '🙈'}
          </button>
        </div>

        <div className="min-h-[20px] mb-1">
          {error && <div className="text-red-300 text-sm">{error}</div>}
        </div>

        <div className="h-[20px] mb-3">
          <div
            className={`text-amber-300 text-sm transition-opacity ${passwordFocused && capsLockOn ? 'opacity-100' : 'opacity-0'
              }`}
          >
            ⚠️ 大写锁定已开启（Caps Lock）
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !agreed || loginAnim === 'success'}
          className={`
            relative w-full h-14 rounded-xl
            flex items-center justify-center gap-2
            transition overflow-hidden
            ${loginAnim === 'error' ? 'animate-shake' : ''}
            ${loading || !agreed
              ? 'bg-white/30 text-white/60'
              : 'bg-indigo-500 hover:bg-indigo-400'
            }
          `}
        >
          <span>{loading ? '登录中…' : '登录'}</span>
          <PaperAirplaneIcon
            className={`w-5 h-5 transition-all duration-500 ${loginAnim === 'success'
              ? 'translate-x-32 opacity-0 scale-90'
              : ''
              }`}
          />
        </button>

        <label className="mt-4 flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          记住我
        </label>

        <label className="mt-4 flex items-start gap-2 text-xs text-white/70">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            我已阅读并同意
            <Link to="/privacy" className="underline ml-1">
              《隐私条款》
            </Link>
            和
            <Link to="/terms" className="underline ml-1">
              《使用条款》
            </Link>
          </span>
        </label>

        <div className="mt-6 flex justify-between text-sm text-white/70">
          <Link to="/register">用户注册</Link>
          <Link to="/forgot-password">忘记密码？</Link>
        </div>
      </div>
    </div>
  );
}
