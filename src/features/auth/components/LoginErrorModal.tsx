import { useTranslation } from 'react-i18next';
type LoginErrorModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function LoginErrorModal({ open, onConfirm, onCancel }: LoginErrorModalProps) {
  const { t } = useTranslation('common');
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-white px-8 py-7 shadow-xl border border-gray-200 text-gray-900 dark:bg-zinc-800 dark:border-white/10 dark:text-white">
        {/* emoji + 文案 */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <div className="text-6xl">🧐</div>
          {/* 你似乎还没有登录 */}
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {t('modal.loginRequired.title')}
          </p>
          {/* 未能获取到你的用户信息，请重新登录后再试。 */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('modal.loginRequired.description')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center items-center gap-4">
          {onCancel && (
            // 取消按钮
            <button
              type="button"
              onClick={onCancel}
              className="
                px-5 py-2.5
                rounded-lg
                text-sm font-medium
                border border-gray-300
                text-gray-600
                hover:bg-gray-100
                transition-colors
                dark:border-gray-500/50
                dark:text-gray-300
                dark:hover:bg-white/10
              "
            >
              {t('modal.action.cancel')}
            </button>
          )}
          {/* 前往登录按钮 */}
          <button
            type="button"
            onClick={onConfirm}
            className="
              px-5 py-2.5
              rounded-lg
              text-sm font-medium
              bg-orange-500 hover:bg-orange-600
              text-black
              transition-colors
            "
          >
            {t('modal.loginRequired.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
