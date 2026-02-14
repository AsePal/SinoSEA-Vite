import { useTranslation } from 'react-i18next';

type SessionExpiredModalProps = {
  open: boolean;
  onConfirm: () => void;
};

export default function SessionExpiredModal({ open, onConfirm }: SessionExpiredModalProps) {
  const { t } = useTranslation('common');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-white text-gray-900 dark:bg-gray-900 dark:text-white px-8 py-7 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* emoji + 文案 */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <div className="text-6xl">⏰</div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {t('modal.sessionExpired.title')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('modal.sessionExpired.description')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onConfirm}
            className="
              w-full
              rounded-lg
              bg-blue-600 hover:bg-blue-700
              px-6 py-2.5
              text-white font-medium
              transition
            "
          >
            {t('modal.sessionExpired.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
