import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../../shared/api/config';
import { SuccessToastModal } from '../../../shared/components';
import {
  SparklesIcon,
  EnvelopeIcon,
  UserIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type VerifyMethod = 'phone' | 'email';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const [method, setMethod] = useState<VerifyMethod | ''>('');
  const [username, setUsername] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const tmr = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(tmr);
  }, [countdown]);

  const handleIdentifierChange = (value: string) => {
    const trimmed = value.replace(/\s/g, '');
    if (method === 'phone') {
      setIdentifier(trimmed.replace(/\D/g, ''));
      return;
    }
    setIdentifier(trimmed);
  };

  const handleSendCode = async () => {
    if (!method || !identifier) return setError(t('register.error.incomplete'));

    setLoading(true);
    setError('');

    try {
      const body = method === 'email' ? { email: identifier } : { phone: identifier };

      const res = await fetch(API.auth.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('sendFailed');

      setCodeSent(true);
      setCountdown(60);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch {
      setError(t('register.error.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!username || !password || !confirmPassword || !verificationCode)
      return setError(t('register.error.incomplete'));

    if (password !== confirmPassword) return setError(t('register.error.mismatch'));

    setLoading(true);
    setError('');

    try {
      const body: any = {
        username,
        password,
        verificationCode,
      };

      if (method === 'email') {
        body.email = identifier;
      } else {
        body.phone = identifier;
      }

      const res = await fetch(API.auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('registerFailed');

      const data = await res.json();
      localStorage.setItem('auth_token', data.accessToken);

      setShowSuccess(true);
      setTimeout(() => navigate('/chat'), 1800);
    } catch {
      setError(t('register.error.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 验证码输入框 refs
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);

  // 处理验证码输入
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1);
    setCodeDigits(newDigits);
    setVerificationCode(newDigits.join(''));

    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...codeDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setCodeDigits(newDigits);
    setVerificationCode(newDigits.join(''));
    const lastIndex = Math.min(pastedData.length, 5);
    codeInputRefs.current[lastIndex]?.focus();
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
            {t('register.title')}
          </h1>
          <span className="text-base text-gray-500 dark:text-gray-400 mt-1">
            {t('register.subtitle')}
          </span>
        </div>
      </div>

      {/* 表单卡片 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleReset();
        }}
        className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 px-8 py-8"
      >
        {/* 注册方式选择 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('register.label.method')}
        </label>
        <div className="relative mb-5">
          <button
            type="button"
            onClick={() => setMethodOpen((v) => !v)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <span
              className={
                method ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
              }
            >
              {method === 'phone'
                ? t('register.method.phone')
                : method === 'email'
                  ? t('register.method.email')
                  : t('register.method.label')}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 transition-transform ${methodOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {methodOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-xl overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setIdentifier('');
                  setCodeSent(false);
                  setMethodOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                {t('register.method.phone')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMethod('email');
                  setIdentifier('');
                  setCodeSent(false);
                  setMethodOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                {t('register.method.email')}
              </button>
            </div>
          )}
        </div>

        {/* 邮箱/手机号输入 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {method === 'email' ? t('register.label.email') : t('register.label.phone')}
        </label>
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <EnvelopeIcon className="w-5 h-5" />
          </div>
          <input
            disabled={!method}
            name={method === 'email' ? 'email' : method === 'phone' ? 'tel' : undefined}
            autoComplete={method === 'email' ? 'email' : method === 'phone' ? 'tel' : undefined}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
            placeholder={
              method === 'email'
                ? t('register.placeholder.identifier_email')
                : t('register.placeholder.identifier_phone')
            }
            value={identifier}
            inputMode={method === 'phone' ? 'numeric' : 'email'}
            pattern={method === 'phone' ? '[0-9]*' : undefined}
            onChange={(e) => handleIdentifierChange(e.currentTarget.value)}
          />
        </div>

        {/* 用户名输入 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('register.label.username')}
        </label>
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <UserIcon className="w-5 h-5" />
          </div>
          <input
            disabled={!method}
            name="username"
            autoComplete="username"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
            placeholder={t('register.placeholder.username')}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value.replace(/\s/g, ''))}
          />
        </div>

        {/* 发送验证码按钮 */}
        <button
          disabled={!method || !identifier || !username || countdown > 0 || loading}
          onClick={handleSendCode}
          className={`w-full h-12 rounded-xl font-medium transition-all duration-300 mb-5 ${
            countdown > 0 || !method || !identifier || !username
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {loading && !codeSent
            ? t('register.action.sending')
            : countdown > 0
              ? `${countdown}s`
              : t('register.action.sendCode')}
        </button>

        {/* 验证码发送成功提示 */}
        {codeSent && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-sm">{t('register.toast.codeSentTitle')}</span>
          </div>
        )}

        {/* 验证码输入 - 6位分离输入框 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('register.label.code')}
        </label>
        <div className="flex gap-2 mb-5" onPaste={handleCodePaste}>
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                codeInputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              disabled={!codeSent}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(index, e)}
              className={`
                w-full h-14 text-center text-xl font-semibold
                rounded-xl bg-gray-50 dark:bg-gray-700
                border-2 transition-all duration-200
                text-gray-900 dark:text-gray-100
                placeholder-gray-300 dark:placeholder-gray-600
                focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                disabled:opacity-50 disabled:cursor-not-allowed
                ${digit ? 'border-indigo-500 dark:border-indigo-400' : 'border-gray-200 dark:border-gray-600'}
              `}
              placeholder="0"
            />
          ))}
        </div>

        {/* 密码 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('register.label.password')}
        </label>
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LockClosedIcon className="w-5 h-5" />
          </div>
          <input
            disabled={!codeSent}
            type="password"
            name="password"
            autoComplete="new-password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
            placeholder={t('register.placeholder.password')}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value.replace(/\s/g, ''))}
          />
        </div>

        {/* 确认密码 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('register.label.confirmPassword')}
        </label>
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LockClosedIcon className="w-5 h-5" />
          </div>
          <input
            disabled={!codeSent}
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
            placeholder={t('register.placeholder.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
          />
        </div>

        {/* 错误提示 */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* 注册按钮 */}
        <button
          type="submit"
          disabled={!codeSent || loading || verificationCode.length !== 6}
          className={`w-full h-12 rounded-xl font-medium transition-all duration-300 ${
            !codeSent || verificationCode.length !== 6
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {loading ? t('register.action.submitting') : t('register.action.submit')}
        </button>

        {/* 返回登录链接 */}
        <div className="mt-4 text-right">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition"
          >
            {t('register.action.back')}
          </Link>
        </div>
      </form>

      {/* Toast 提示 */}
      <SuccessToastModal
        open={showToast}
        title={t('register.toast.codeSentTitle')}
        description={t('register.toast.codeSentDesc')}
      />
      <SuccessToastModal
        open={showSuccess}
        title={t('register.toast.registerSuccessTitle')}
        description={t('register.toast.registerSuccessDesc')}
      />
    </div>
  );
}
