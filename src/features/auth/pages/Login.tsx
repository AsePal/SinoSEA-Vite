import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API, { apiRequest } from '../../../shared/api/config';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

type LoginAnim = 'idle' | 'success' | 'error';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginAnim, setLoginAnim] = useState<LoginAnim>('idle');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => setCapsLockOn(e.getModifierState('CapsLock'));

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('remember_account');
    if (saved) {
      setAccount(saved);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!agreed) return setError(t('error.needAgree'));
    if (!account || !password) return setError(t('error.empty'));
    if (/\s/.test(account) || /\s/.test(password)) return setError(t('error.space'));

    setLoading(true);
    setError('');

    try {
      const res = await apiRequest(API.auth.login, {
        method: 'POST',
        body: { identifier: account, password },
      });

      if (res.status === 401) throw new Error('unauthorized');
      if (!res.ok) throw new Error('failed');

      const data = await res.json();
      localStorage.setItem('auth_token', data.accessToken);

      if (rememberMe) {
        localStorage.setItem('remember_account', account);
      } else {
        localStorage.removeItem('remember_account');
      }

      setLoginAnim('success');

      // ✅ 关键闭环逻辑：检查是否有待发送的消息
      const pendingMessage = sessionStorage.getItem('pending_chat_message');

      setTimeout(() => {
        if (pendingMessage) {
          // 不在这里发送，只负责回到 Chat
          navigate('/chat', { replace: true });
        } else {
          // 普通登录行为保持不变
          navigate('/chat');
        }
      }, 350);
    } catch (e: any) {
      const key = e.message === 'unauthorized' ? 'unauthorized' : 'failed';
      setError(t(`error.${key}`));
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
          rounded-3xl bg-white/20 
          border border-white/30
          shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          px-14 py-16 text-white
          transition-all duration-400 ease-out
          ${ready ? 'backdrop-blur-lg' : 'backdrop-blur-none'}
        `}
      >
        <h1 className="text-3xl font-semibold mb-2 text-center">{t('title')}</h1>
        <p className="text-white/70 mb-10 text-center">{t('subtitle')}</p>

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/60"
          placeholder={t('placeholder.account')}
          value={account}
          onChange={(e) => setAccount(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/20 border border-white/30 placeholder-white/60"
            placeholder={t('placeholder.password')}
            value={password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChange={(e) => setPassword(e.currentTarget.value.replace(/\s/g, ''))}
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
            className={`text-amber-300 text-sm transition-opacity ${
              passwordFocused && capsLockOn ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {t('capsLock')}
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
            ${
              loading || !agreed ? 'bg-white/30 text-white/60' : 'bg-indigo-500 hover:bg-indigo-400'
            }
          `}
        >
          <span>{loading ? t('action.loggingIn') : t('action.login')}</span>
          <PaperAirplaneIcon
            className={`w-5 h-5 transition-all duration-500 ${
              loginAnim === 'success' ? 'translate-x-32 opacity-0 scale-90' : ''
            }`}
          />
        </button>

        <label className="mt-4 flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          {t('option.rememberMe')}
        </label>

        <label className="mt-4 flex items-start gap-2 text-xs text-white/70">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            {t('agreement.prefix')}
            <Link to="/privacy" className="underline ml-1">
              {t('agreement.privacy')}
            </Link>
            {t('agreement.and', { defaultValue: ' 和 ' })}
            <Link to="/terms" className="underline ml-1">
              {t('agreement.terms')}
            </Link>
          </span>
        </label>

        <div className="mt-6 flex justify-between text-sm text-white/70">
          <Link to="/register">{t('link.register')}</Link>
          <Link to="/forgot-password">{t('link.forgot')}</Link>
        </div>
        {/* 不登录直接进入 Chat */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className=" text-sm tracking-wide text-white/60 hover:text-white transition"
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
}
