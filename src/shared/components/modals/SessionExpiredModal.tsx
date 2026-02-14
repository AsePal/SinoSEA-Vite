import { useTranslation } from 'react-i18next';

type SessionExpiredModalProps = {
  open: boolean;
  onConfirm: () => void;
  onBackHome?: () => void;
};

export default function SessionExpiredModal({
  open,
  onConfirm,
  onBackHome,
}: SessionExpiredModalProps) {
  const { t } = useTranslation('common');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
        <div className={`flex gap-3 ${onBackHome ? 'flex-row' : 'flex-col'}`}>
          {onBackHome && (
            <button
              type="button"
              onClick={onBackHome}
              className="
                flex-1
                rounded-lg
                border border-blue-200 dark:border-blue-800
                px-6 py-2.5
                text-blue-700 dark:text-blue-200
                bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:hover:bg-blue-900/50
                font-medium
                transition
              "
            >
              {t('modal.sessionExpired.backHome')}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className="
              flex-1
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
