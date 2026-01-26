type LoginErrorModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel?: () => void; // ⚠️ 开发阶段用，后续可移除
};

export default function LoginErrorModal({
  open,
  onConfirm,
  onCancel,
}: LoginErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-2xl bg-zinc-900 p-6 shadow-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">
          登录状态异常
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          未能获取到你的用户信息，请重新登录后再试。
        </p>

        <div className="flex justify-end gap-3">
          {/* 
            ⚠️【开发阶段临时按钮】
            用于调试 / 本地开发
            后续上线前可直接删除
          */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"
            >
              取消
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-orange-500 hover:bg-orange-600 text-black font-medium"
          >
            返回登录页
          </button>
        </div>
      </div>
    </div>
  );
}
