import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../../shared/api/config';
import { SuccessToastModal } from '../../../shared/components';
import { useTranslation } from 'react-i18next';

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

  const handleSendCode = async () => {
    if (!method || !identifier) return setError('请填写完整信息');
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
    if (!verificationCode || !newPassword || !confirmPassword) return setError('');
    // 两次密码不一致
    if (newPassword !== confirmPassword) return setError('');

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
      if (!res.ok) throw new Error(t('forgot.error.sendFailed'));

      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (e: any) {
      setError(e.message || t('forgot.error.sendFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="min-h-[620px] rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)] px-14 py-16 text-white">
        {/* 重置密码 */}
        <h1 className="text-3xl font-semibold mb-2 text-center">{t('forgot.title')}</h1>
        {/* 通过验证码设置新密码 */}
        <p className="text-white/70 mb-10 text-center">{t('forgot.subtitle')}</p>

        <div className="relative mb-4">
          {/* 触发按钮 */}
          <button
            type="button"
            onClick={() => setMethodOpen((v) => !v)}
            className="
      w-full px-4 py-3 rounded-xl
      bg-white/20 border border-white/30
      text-left text-white
      flex items-center justify-between
      hover:bg-white/25 transition
    "
          >
            <span className={method ? 'text-white' : 'text-white/60'}>
              {/* 验证方式 */}
              {method === 'phone'
                ? t('forgot.method.phone')
                : method === 'email'
                  ? t('forgot.method.email')
                  : t('forgot.method.placeholder')}
            </span>
            <span className="text-white/60">▾</span>
          </button>

          {/* 下拉面板 */}
          {methodOpen && (
            <div
              className="
        absolute z-20 mt-2 w-full
        rounded-xl overflow-hidden
        bg-zinc-900/95 backdrop-blur
        border border-white/20
        shadow-xl
      "
            >
              {/* 手机号 */}
              <button
                type="button"
                onClick={() => {
                  setMethod('phone');
                  setIdentifier('');
                  setCodeSent(false);
                  setMethodOpen(false);
                }}
                className="
          w-full px-4 py-3 text-left
          hover:bg-white/10 transition
        "
              >
                {t('forgot.method.phone')}
              </button>

              {/* 邮箱 */}
              <button
                type="button"
                onClick={() => {
                  setMethod('email');
                  setIdentifier('');
                  setCodeSent(false);
                  setMethodOpen(false);
                }}
                className="
          w-full px-4 py-3 text-left
          hover:bg-white/10 transition
        "
              >
                {t('forgot.method.email')}
              </button>
            </div>
          )}
        </div>
        {/* 请输入手机号/邮箱 */}
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

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* 验证码 */}
          <input
            disabled={!codeSent}
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30"
            placeholder={t('forgot.placeholder.code')}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value.replace(/\s/g, ''))}
          />
          {/* 发送验证码 */}
          <button
            disabled={!method || !identifier || countdown > 0}
            onClick={handleSendCode}
            className={`
              w-full sm:w-auto
              px-4 py-3
              rounded-xl
              whitespace-nowrap
              transition
              ${
                countdown > 0
                  ? 'bg-white/30 text-white/50 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-400'
              }
            `}
          >
            {countdown > 0 ? `${countdown}s` : t('forgot.action.sendCode')}
          </button>
        </div>
        {/* 新密码 */}
        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder={t('forgot.placeholder.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />
        {/* 确认新密码 */}
        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-white/20 border border-white/30"
          placeholder={t('forgot.placeholder.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        {error && <div className="text-red-300 text-sm mb-4">{error}</div>}
        {/* 提交中/重置密码 */}
        <button
          onClick={handleReset}
          disabled={!codeSent || loading}
          className="w-full h-14 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition"
        >
          {loading ? t('forgot.action.submitting') : t('forgot.action.submit')}
        </button>
        {/* 返回登录 */}
        <div className="mt-8 text-sm text-white/70 text-center">
          <Link to="/login">{t('forgot.action.back')}</Link>
        </div>
      </div>
      {/* 验证码已发送/有效期5分钟 */}
      <SuccessToastModal
        open={showToast}
        title={t('forgot.toast.codeSentTitle')}
        description={t('forgot.toast.codeSentDesc')}
      />
      {/* 密码重置成功/请使用新的密码登录 */}
      <SuccessToastModal
        open={showSuccess}
        title={t('forgot.toast.successTitle')}
        description={t('forgot.toast.successDesc')}
      />
    </div>
  );
}
