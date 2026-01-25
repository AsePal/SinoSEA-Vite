import { useRef, useState } from 'react';
import { useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
//校验用户上传头像的类型
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;




type Props = {
  open: boolean;
  currentAvatar: string;
  onClose: () => void;
  onSuccess: (newAvatarUrl: string) => void;
};

export default function AvatarEditorModal({
  open,
  currentAvatar,
  onClose,
  onSuccess,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentAvatar);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  

  useEffect(() => {
    setPreview(currentAvatar);
    setSelectedFile(null);
  }, [currentAvatar]);


  function triggerFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 简单校验
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      alert('仅支持 JPG / PNG / GIF / WebP 格式的图片');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!selectedFile) {
      onClose();
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type as any)) {
      alert('图片格式不支持，请重新选择');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile); // ⚠️ 参数名必须是 file

      const token = localStorage.getItem('auth_token');

      const res = await fetch('http://192.168.10.164:3000/user/image', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('头像上传失败');
      }

      const data = await res.json();

      // 后端返回 avatarUrl
      onSuccess(data.avatarUrl);
      onClose();
    } catch (e) {
      alert('头像更新失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999]
                     bg-black/60 backdrop-blur-sm
                     flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="
              w-[420px] rounded-2xl
              bg-white/90 backdrop-blur-xl
              shadow-[0_30px_80px_rgba(0,0,0,0.35)]
              px-8 py-6
            "
          >
            {/* 标题 */}
            <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
              修改头像
            </h2>

            {/* 头像区域 */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={triggerFileSelect}
                className="
                  relative group
                  w-32 h-32 rounded-full overflow-hidden
                  ring-4 ring-blue-500/30
                  hover:ring-blue-500/60
                  transition
                "
              >
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />

                {/* hover 遮罩 */}
                <div className="
                  absolute inset-0
                  bg-black/40 opacity-0
                  group-hover:opacity-100
                  flex items-center justify-center
                  text-white text-sm
                  transition
                ">
                  点击更换
                </div>
              </button>

              <p className="text-sm text-gray-500">
                支持 JPG / PNG / GIF / WebP ≤ 5MB
              </p>
            </div>

            {/* 底部按钮 */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="
                  px-5 py-2 rounded-lg
                  text-gray-600 hover:bg-gray-100
                  transition
                "
              >
                取消
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="
                  px-6 py-2 rounded-lg
                  bg-blue-600 text-white
                  hover:bg-blue-500
                  shadow-blue-500/30
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {loading ? '保存中…' : '保存'}
              </button>
            </div>

            {/* 隐藏 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hidden
              onChange={handleFileChange}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
