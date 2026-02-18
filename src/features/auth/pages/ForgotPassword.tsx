import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../../shared/api/config';
import { SuccessToastModal } from '../../../shared/components';
import { useTranslation } from 'react-i18next';
import {
  SparklesIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

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
  const [methodOpen, setMethodOpen] = useState(false);
  const { t } = useTranslation('auth');

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
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
    if (!method || !identifier) {
      return setError(t('forgot.error.incomplete'));
    }
    setLoading(true);
    setError('');

    try {
      const body = method === 'email' ? { email: identifier } : { phone: identifier };

      const res = await fetch(API.auth.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      //发送失败
      if (!res.ok) throw new Error(t('forgot.error.sendFailed'));

      setCodeSent(true);
      setCountdown(60);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch (e: any) {
      // 发送失败
      setError(e.message || t('forgot.error.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    // 请填写完整信息
    if (!verificationCode || verificationCode.length !== 6 || !newPassword || !confirmPassword) {
      return setError(t('forgot.error.incomplete'));
    }
    // 两次密码不一致
    if (newPassword !== confirmPassword) {
      return setError(t('forgot.error.mismatch'));
    }

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
      // 重置失败提示
      if (!res.ok) throw new Error(t('forgot.error.resetFailed'));

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (e: any) {
      setError(e.message || t('forgot.error.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  // 验证码输入框 refs
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '', '']);

  // 处理验证码输入
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // 只允许数字

    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1); // 只取最后一个字符
    setCodeDigits(newDigits);
    setVerificationCode(newDigits.join(''));

    // 自动跳到下一个输入框
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  // 处理退格键
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // 处理粘贴
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...codeDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setCodeDigits(newDigits);
    setVerificationCode(newDigits.join(''));
    // 聚焦到最后一个填充的输入框
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
            {t('forgot.title')}
          </h1>
          <span className="text-base text-gray-500 dark:text-gray-400 mt-1">
            {t('forgot.subtitle')}
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
        {/* 验证方式选择 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('forgot.label.method')}
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
                ? t('forgot.method.phone')
                : method === 'email'
                  ? t('forgot.method.email')
                  : t('forgot.method.placeholder')}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 transition-transform ${methodOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* 下拉面板 */}
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
                {t('forgot.method.phone')}
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
                {t('forgot.method.email')}
              </button>
            </div>
          )}
        </div>

        {/* 邮箱/手机号输入 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {method === 'email' ? t('forgot.label.email') : t('forgot.label.phone')}
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
                ? t('forgot.placeholder.identifier_email')
                : t('forgot.placeholder.identifier_phone')
            }
            value={identifier}
            inputMode={method === 'phone' ? 'numeric' : 'email'}
            pattern={method === 'phone' ? '[0-9]*' : undefined}
            onChange={(e) => handleIdentifierChange(e.currentTarget.value)}
          />
        </div>

        {/* 发送验证码按钮 */}
        <button
          disabled={!method || !identifier || countdown > 0 || loading}
          onClick={handleSendCode}
          className={`w-full h-12 rounded-xl font-medium transition-all duration-300 mb-5 ${
            countdown > 0 || !method || !identifier
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {loading
            ? t('forgot.action.sending')
            : countdown > 0
              ? `${countdown}s`
              : t('forgot.action.sendCode')}
        </button>

        {/* 验证码发送成功提示 */}
        {codeSent && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-sm">{t('forgot.toast.codeSentTitle')}</span>
          </div>
        )}

        {/* 验证码输入 - 6位分离输入框 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('forgot.label.code')}
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

        {/* 新密码 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('forgot.label.newPassword')}
        </label>
        <div className="relative mb-5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <LockClosedIcon className="w-5 h-5" />
          </div>
          <input
            disabled={!codeSent}
            type="password"
            name="newPassword"
            autoComplete="new-password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50"
            placeholder={t('forgot.placeholder.newPassword')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value.replace(/\s/g, ''))}
          />
        </div>

        {/* 确认新密码 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('forgot.label.confirmPassword')}
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
            placeholder={t('forgot.placeholder.confirmPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
          />
        </div>

        {/* 错误提示 */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* 重置密码按钮 */}
        <button
          type="submit"
          disabled={!codeSent || loading || verificationCode.length !== 6}
          className={`w-full h-12 rounded-xl font-medium transition-all duration-300 ${
            !codeSent || verificationCode.length !== 6
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {loading ? t('forgot.action.submitting') : t('forgot.action.submit')}
        </button>

        {/* 返回登录链接 */}
        <div className="mt-4 text-right">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition"
          >
            {t('forgot.action.back')}
          </Link>
        </div>
      </form>

      {/* Toast 提示 */}
      <SuccessToastModal
        open={showToast}
        title={t('forgot.toast.codeSentTitle')}
        description={t('forgot.toast.codeSentDesc')}
      />
      <SuccessToastModal
        open={showSuccess}
        title={t('forgot.toast.successTitle')}
        description={t('forgot.toast.successDesc')}
      />
    </div>
  );
}
