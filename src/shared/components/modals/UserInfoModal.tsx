import { XMarkIcon, PencilSquareIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import type { UserInfo } from '../../types/user.types';

export default function UserInfoModal({
  open,
  user,
  onClose,
  onEditAvatar,
  onLogout,
}: {
  open: boolean;
  user: UserInfo | null | undefined;
  onClose: () => void;
  onEditAvatar?: () => void;
  onLogout?: () => void;
}) {
  if (!open) return null;

  const { t } = useTranslation('chat');

  const DEFAULT_AVATAR = '/userlogo.ico';
  const displayName = user?.nickname || t('userInfoModal.guestName');
  const displayPhone = user?.phone || t('userInfoModal.unboundPhone');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t('userInfoModal.title')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={t('userInfoModal.close')}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt="avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {displayPhone}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditAvatar?.();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <PencilSquareIcon className="w-4 h-4" />
              {t('userInfoModal.editAvatar')}
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t('userInfoModal.editNickname')}
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t('userInfoModal.editPhone')}
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                {t('userInfoModal.logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
