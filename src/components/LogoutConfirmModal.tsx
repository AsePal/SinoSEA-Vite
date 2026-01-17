type LogoutConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LogoutConfirmModal({
  open,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm rounded-2xl bg-zinc-900 p-6 shadow-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">
          确认退出登录
        </h3>

        <p className="text-sm text-gray-400 mb-6">
          退出后需要重新登录，是否确认退出？
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10"
          >
            取消
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            确认退出
          </button>
        </div>
      </div>
    </div>
  );
}
