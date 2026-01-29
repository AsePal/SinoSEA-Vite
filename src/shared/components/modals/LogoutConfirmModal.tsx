import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LogoutConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LogoutConfirmModal({ open, onConfirm, onCancel }: LogoutConfirmModalProps) {
  const { t } = useTranslation('common');

  type EmojiState = '😯' | '👻' | '😨';

  const [emoji, setEmoji] = useState<EmojiState>('😯');

  useEffect(() => {
    if (open) {
      setEmoji('😯');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-white text-gray-900 dark:bg-gray-900 dark:text-white px-8 py-7 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* emoji + 文案 */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <div className="text-6xl transition-transform duration-200">{emoji}</div>
          {/* 你真的要退出吗？ */}
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {t('modal.logoutConfirm.title')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center">
          {/* 取消（左侧 / 蓝色） */}
          {/* 取消按钮 */}
          <button
            type="button"
            onClick={onCancel}
            onMouseEnter={() => setEmoji('👻')}
            onMouseLeave={() => setEmoji('😯')}
            className="
              px-5 py-2.5
              rounded-lg
              text-sm font-medium
              border border-blue-500/60
              text-blue-400
              hover:bg-blue-500
              hover:text-white
              transition-colors
            "
          >
            {t('modal.action.cancel')}
          </button>

          {/* 确认退出（右侧 / 危险） */}
          <button
            type="button"
            onClick={onConfirm}
            onMouseEnter={() => setEmoji('😨')}
            onMouseLeave={() => setEmoji('😯')}
            className="
              px-5 py-2.5
              rounded-lg
              text-sm
              bg-red-500 hover:bg-red-600
              text-white font-medium
              transition-colors
            "
          >
            {t('modal.logoutConfirm.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
