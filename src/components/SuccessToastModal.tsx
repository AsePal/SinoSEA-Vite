import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  open: boolean;
  title?: string;
  description?: string;
};

export default function SuccessToastModal({
  open,
  title = '操作成功',
  description = '',
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* 卡片 */}
          <motion.div
            initial={{ scale: 0.92, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="
              relative z-10
              w-full max-w-sm
              rounded-2xl
              bg-white/20
              backdrop-blur-lg
              border border-white/30
              shadow-[0_20px_60px_rgba(0,0,0,0.4)]
              px-8 py-10
              text-center text-white
            "
          >
            {/* 手绘成功图标 */}
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16"
                viewBox="0 0 52 52"
                fill="none"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="24"
                  stroke="rgba(74,222,128,0.9)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="draw-circle"
                />
                <path
                  d="M14 27 L23 35 L38 18"
                  stroke="rgba(74,222,128,0.9)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="draw-check"
                />
              </svg>
            </div>

            {/* 文案 */}
            <h2 className="text-xl font-semibold mb-2">
              {title}
            </h2>

            {description && (
              <p className="text-sm text-white/80">
                {description}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
