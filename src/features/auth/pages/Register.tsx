import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../../../shared/api/config';
import { SuccessToastModal } from '../../../shared/components';

type VerifyMethod = 'phone' | 'email';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

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

  useEffect(() => {
    if (countdown <= 0) return;
    const tmr = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(tmr);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!method || !identifier) return setError(t('forgot.error.incomplete'));

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
      setError(t('forgot.error.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!verificationCode || !newPassword || !confirmPassword)
      return setError(t('forgot.error.incomplete'));

    if (newPassword !== confirmPassword) return setError(t('forgot.error.mismatch'));

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

      if (!res.ok) throw new Error('resetFailed');

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch {
      setError(t('forgot.error.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="min-h-[620px] rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)] px-14 py-16 text-white">
        <h1 className="text-3xl font-semibold mb-2 text-center">{t('forgot.title')}</h1>
        <p className="text-white/70 mb-10 text-center">{t('forgot.subtitle')}</p>

        {/* 验证方式选择 */}
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setMethodOpen((v) => !v)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-left flex justify-between"
          >
            <span className={method ? 'text-white' : 'text-white/60'}>
              {method === 'phone'
                ? t('forgot.method.phone')
                : method === 'email'
                  ? t('forgot.method.email')
                  : t('forgot.method.label')}
            </span>
            <span className="text-white/60">▾</span>
          </button>

          {methodOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-xl overflow-hidden bg-zinc-900/95 border border-white/20">
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setIdentifier('');
                  setCodeSent(false);
                  setMethodOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-white/10"
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
                className="w-full px-4 py-3 text-left hover:bg-white/10"
              >
                {t('forgot.method.email')}
              </button>
            </div>
          )}
        </div>

        <input
          disabled={!method}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder={
            method === 'email'
              ? t('forgot.placeholder.identifier_email')
              : t('forgot.placeholder.identifier_phone')
          }
          value={identifier}
          onChange={(e) => setIdentifier(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            disabled={!codeSent}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
            placeholder={t('forgot.placeholder.code')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value.replace(/\s/g, ''))}
          />

          <button
            disabled={!method || !identifier || countdown > 0}
            onClick={handleSendCode}
            className={`px-4 py-3 rounded-xl ${
              countdown > 0 ? 'bg-white/30 text-white/50' : 'bg-indigo-500 hover:bg-indigo-400'
            }`}
          >
            {countdown > 0 ? `${countdown}s` : t('forgot.action.sendCode')}
          </button>
        </div>

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder={t('forgot.placeholder.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder={t('forgot.placeholder.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        {error && <div className="text-red-300 text-sm mb-4">{error}</div>}

        <button
          onClick={handleReset}
          disabled={!codeSent || loading}
          className="w-full h-14 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition"
        >
          {loading ? t('forgot.action.submitting') : t('forgot.action.reset')}
        </button>

        <div className="mt-8 text-sm text-white/70 text-center">
          <Link to="/login">{t('forgot.action.back')}</Link>
        </div>
      </div>

      <SuccessToastModal
        open={showToast}
        title={t('forgot.toast.codeSentTitle')}
        description={t('forgot.toast.codeSentDesc')}
      />
      <SuccessToastModal
        open={showSuccess}
        title={t('forgot.toast.resetSuccessTitle')}
        description={t('forgot.toast.resetSuccessDesc')}
      />
    </div>
  );
}
