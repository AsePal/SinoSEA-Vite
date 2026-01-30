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
      <div className="min-h-[620px] rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_30px_80px_rgba(0,0,0,0.25)] px-14 py-16">
        {/* 重置密码 */}
        <h1 className="text-3xl font-semibold mb-2 text-center text-gray-900 dark:text-gray-100">
          {t('forgot.title')}
        </h1>
        {/* 通过验证码设置新密码 */}
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-center">{t('forgot.subtitle')}</p>

        <div className="relative mb-4">
          {/* 触发按钮 */}
          <button
            type="button"
            onClick={() => setMethodOpen((v) => !v)}
            className="
      w-full px-4 py-3 rounded-xl
      bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
      text-left text-gray-900 dark:text-gray-100
      flex items-center justify-between
      hover:bg-gray-100 dark:hover:bg-gray-700 transition
    "
          >
            <span className={method ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}>
              {/* 验证方式 */}
              {method === 'phone'
                ? t('forgot.method.phone')
                : method === 'email'
                  ? t('forgot.method.email')
                  : t('forgot.method.placeholder')}
            </span>
            <span className="text-gray-400">▾</span>
          </button>

          {/* 下拉面板 */}
          {methodOpen && (
            <div
              className="
        absolute z-20 mt-2 w-full
        rounded-xl overflow-hidden
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
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
                  w-full px-4 py-3 text-left text-gray-800 dark:text-gray-100
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition
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
                  w-full px-4 py-3 text-left text-gray-800 dark:text-gray-100
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition
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
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
                  ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
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
          className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('forgot.placeholder.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />
        {/* 确认新密码 */}
        <input
          disabled={!codeSent}
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={t('forgot.placeholder.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''))}
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {/* 提交中/重置密码 */}
        <button
          onClick={handleReset}
          disabled={!codeSent || loading}
          className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
        >
          {loading ? t('forgot.action.submitting') : t('forgot.action.submit')}
        </button>
        {/* 返回登录 */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
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
