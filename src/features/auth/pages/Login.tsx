import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import API, { apiRequest } from '../../../shared/api/config';
import { ArrowRightIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

type LoginAnim = 'idle' | 'success' | 'error';
const qqIcon = '/QQ%20LOGO.png';
const wechatIcon = '/VX%20LOGO.png';
const githubIcon = '/GITHUB%20LOGO%20.png';

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
    <div className="w-full max-w-lg px-4">
      {/* Logo+标题 左右结构 */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-4">
          <SparklesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {t('title')}
          </h1>
          <span className="text-base text-gray-500 dark:text-gray-400 mt-1">{t('subtitle')}</span>
        </div>
      </div>

      {/* 表单卡片 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className={`
          rounded-2xl bg-white dark:bg-gray-800
          shadow-xl dark:shadow-gray-900/50
          px-8 py-8
          transition-all duration-400 ease-out
          ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* 账号输入 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('label.account')}
        </label>
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <UserIcon className="w-5 h-5" />
          </div>
          <input
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder={t('placeholder.account')}
            value={account}
            name="identifier"
            autoComplete="username"
            onChange={(e) => setAccount(e.currentTarget.value.replace(/\s/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
        </div>

        {/* 密码输入 */}
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('label.password')}
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {t('link.forgot')}
          </Link>
        </div>
        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LockClosedIcon className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
            tabIndex={-1}
          >
            {showPassword ? '🧐' : '🙈'}
          </button>
        </div>

        {/* 错误提示 */}
        <div className="min-h-[20px] mb-1">
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        {/* 大写锁定提示 */}
        <div className="h-[20px] mb-3">
          <div
            className={`text-amber-500 text-sm transition-opacity ${
              passwordFocused && capsLockOn ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {t('capsLock')}
          </div>
        </div>

        {/* 登录按钮 */}
        <button
          type="submit"
          disabled={loading || !agreed || loginAnim === 'success'}
          className={`
            relative w-full h-12 rounded-xl
            flex items-center justify-center gap-2
            font-medium
            transition-all duration-300 overflow-hidden
            ${loginAnim === 'error' ? 'animate-shake' : ''}
            ${
              loading || !agreed
                ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
            }
          `}
        >
          <span>{loading ? t('action.loggingIn') : t('action.login')}</span>
          <ArrowRightIcon
            className={`w-5 h-5 transition-all duration-500 ${
              loginAnim === 'success' ? 'translate-x-32 opacity-0' : ''
            }`}
          />
        </button>

        {/* 返回主页链接 */}
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition"
          >
            {t('link.backHome')}
          </button>
        </div>

        {/* 第三方登录分隔与按钮 */}
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
              其他登录方式
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="mt-3 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                aria-label="QQ 授权登录"
                className="h-10 w-10 rounded-full bg-transparent hover:scale-105 hover:shadow-md transition flex items-center justify-center overflow-hidden"
              >
                <img src={qqIcon} alt="QQ" className="w-full h-full object-contain" />
              </button>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {t('social.qq', { defaultValue: 'QQ' })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                aria-label="微信授权登录"
                className="h-10 w-10 rounded-full bg-transparent hover:scale-105 hover:shadow-md transition flex items-center justify-center overflow-hidden"
              >
                <img src={wechatIcon} alt="WeChat" className="w-full h-full object-contain" />
              </button>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {t('social.wechat', { defaultValue: '微信' })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                aria-label="GitHub 授权登录"
                className="h-10 w-10 rounded-full bg-transparent hover:scale-105 hover:shadow-md transition flex items-center justify-center overflow-hidden"
              >
                <img src={githubIcon} alt="GitHub" className="w-full h-full object-contain" />
              </button>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {t('social.github', { defaultValue: 'GitHub' })}
              </div>
            </div>
          </div>
        </div>

        {/* 记住我 */}
        <label className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
          />
          {t('option.rememberMe')}
        </label>

        {/* 协议同意 */}
        <label className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <span>
            <Trans
              i18nKey="agreement.text"
              t={t}
              components={{
                privacy: (
                  <Link
                    to="/privacy"
                    className="underline text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  />
                ),
                terms: (
                  <Link
                    to="/terms"
                    className="underline text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  />
                ),
              }}
            />
          </span>
        </label>
      </form>

      {/* 注册链接 */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('link.noAccount')}{' '}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {t('link.register')}
        </Link>
      </div>
    </div>
  );
}
