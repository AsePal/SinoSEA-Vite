import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../../shared/api/config';
import { SuccessToastModal } from '../../../shared/components';

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

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="min-h-[620px] rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_30px_80px_rgba(0,0,0,0.25)] px-14 py-16">
        <h1 className="text-3xl font-semibold mb-2 text-center text-gray-900 dark:text-gray-100">
          {t('register.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-center">
          {t('register.subtitle')}
        </p>

        {/* 验证方式选择 */}
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setMethodOpen((v) => !v)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left flex justify-between"
          >
            <span className={method ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
              {method === 'phone'
                ? t('register.method.phone')
                : method === 'email'
                  ? t('register.method.email')
                  : t('register.method.label')}
            </span>
            <span className="text-gray-400">▾</span>
          </button>

          {methodOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setIdentifier('');
                  setCodeSent(false);
                  setMethodOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="w-full px-4 py-3 text-left text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t('register.method.email')}
              </button>
            </div>
          )}
        </div>

        <input
          disabled={!method}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={
            method === 'email'
              ? t('register.placeholder.identifier_email')
              : t('register.placeholder.identifier_phone')
          }
          value={identifier}
          onChange={(e) => setIdentifier(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <input
          disabled={!method}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('register.placeholder.username')}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            disabled={!codeSent}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder={t('register.placeholder.code')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value.replace(/\s/g, ''))}
          />

          <button
            disabled={!method || !identifier || countdown > 0}
            onClick={handleSendCode}
            className={`px-4 py-3 rounded-xl ${
              countdown > 0
                ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {countdown > 0 ? `${countdown}s` : t('register.action.sendCode')}
          </button>
        </div>

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('register.placeholder.password')}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('register.placeholder.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          onClick={handleReset}
          disabled={!codeSent || loading}
          className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
        >
          {loading ? t('register.action.submitting') : t('register.action.submit')}
        </button>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          <Link to="/login">{t('register.action.back')}</Link>
        </div>
      </div>

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
