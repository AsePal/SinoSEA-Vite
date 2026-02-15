import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type LoginRequiredModalProps = {
  open: boolean;
  onConfirm: () => void;
};

export default function LoginRequiredModal({ open, onConfirm }: LoginRequiredModalProps) {
  const { t } = useTranslation('common');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-[92%] max-w-md rounded-2xl bg-white text-gray-900 dark:bg-gray-900 dark:text-white px-8 py-7 shadow-xl border border-gray-200 dark:border-gray-700"
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
          >
            {/* emoji + 文案 */}
            <div className="flex flex-col items-center text-center mb-8 space-y-4">
              <div className="text-6xl">🔐</div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {t('modal.loginRequired.title')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('modal.loginRequired.description')}
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
                {t('modal.loginRequired.confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
