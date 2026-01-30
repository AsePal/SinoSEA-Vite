import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
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

  // console.log('current lang:', i18n.language);
  // console.log('auth title:', t('title'));

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
    const handleEnterKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && agreed) {
        e.preventDefault();
        handleLogin();
      }
    };

    window.addEventListener('keydown', handleEnterKey);
    return () => {
      window.removeEventListener('keydown', handleEnterKey);
    };
  }, [agreed, account, password, loading]);

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
          rounded-3xl bg-white
          dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          shadow-[0_30px_80px_rgba(0,0,0,0.25)]
          px-14 py-16
          transition-all duration-400 ease-out
          ${ready ? 'backdrop-blur-none' : 'backdrop-blur-none'}
        `}
      >
        <h1 className="text-3xl font-semibold mb-2 text-center text-gray-900 dark:text-gray-100">
          {t('title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-center">{t('subtitle')}</p>

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('placeholder.account')}
          value={account}
          onChange={(e) => setAccount(e.currentTarget.value.replace(/\s/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleLogin();
            }
          }}
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder={t('placeholder.password')}
            value={password}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onChange={(e) => setPassword(e.currentTarget.value.replace(/\s/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? '🧐' : '🙈'}
          </button>
        </div>

        <div className="min-h-[20px] mb-1">
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        <div className="h-[20px] mb-3">
          <div
            className={`text-amber-500 text-sm transition-opacity ${
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
              loading || !agreed
                ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
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

        <label className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          {t('option.rememberMe')}
        </label>

        <label className="mt-4 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600 dark:bg-gray-800 dark:text-indigo-400"
          />
          <span>
            <Trans
              i18nKey="agreement.text"
              t={t}
              components={{
                privacy: (
                  <Link
                    to="/privacy"
                    className="underline ml-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                  />
                ),
                terms: (
                  <Link
                    to="/terms"
                    className="underline ml-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                  />
                ),
              }}
            />
          </span>
        </label>

        <div className="mt-6 flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <Link to="/register">{t('link.register')}</Link>
          <Link to="/forgot-password">{t('link.forgot')}</Link>
        </div>
        {/* 返回首页*/}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className=" text-sm tracking-wide text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            {t('link.backHome')}
          </button>
        </div>
      </div>
    </div>
  );
}
