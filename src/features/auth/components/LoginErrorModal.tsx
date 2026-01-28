type LoginErrorModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function LoginErrorModal({ open, onConfirm, onCancel }: LoginErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-zinc-800 px-8 py-7 shadow-xl border border-white/10">
        {/* emoji + 文案 */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
          <div className="text-6xl">🧐</div>

          <p className="text-lg font-medium text-white">你似乎还没登录</p>

          <p className="text-sm text-gray-400">未能获取到你的用户信息，请重新登录后再试。</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center items-center gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="
                px-5 py-2.5
                rounded-lg
                text-sm font-medium
                border border-gray-500/50
                text-gray-300
                hover:bg-white/10
                transition-colors
              "
            >
              取消
            </button>
          )}

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
            前往登录
          </button>
        </div>
      </div>
    </div>
  );
}
