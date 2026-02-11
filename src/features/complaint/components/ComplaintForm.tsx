import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudArrowUpIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

type AttachmentPreview = {
  id: string;
  name: string;
  url: string;
  isImage: boolean;
};

export default function ComplaintForm() {
  const { t } = useTranslation('complaint');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      attachments.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [attachments]);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    if (files.length === 0) return;

    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]);

    const buildNextAttachments = (prev: AttachmentPreview[]) => {
      const errors: string[] = [];
      const remaining = Math.max(0, 3 - prev.length);

      const valid: File[] = [];
      for (const file of files) {
        const ok = file.type.startsWith('image/') || allowedTypes.has(file.type);
        if (!ok) {
          errors.push(t('message.attachment.invalid', { name: file.name }));
        } else {
          valid.push(file);
        }
      }

      if (remaining === 0) {
        errors.push(t('message.attachment.limit'));
        return { next: prev, errors };
      }

      const accepted = valid.slice(0, remaining).map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        url: URL.createObjectURL(file),
        isImage: file.type.startsWith('image/'),
      }));

      if (valid.length > remaining) {
        errors.push(t('message.attachment.exceeded'));
      }

      return { next: [...prev, ...accepted], errors };
    };

    const result = buildNextAttachments(attachments);
    setAttachments(result.next);
    setAttachmentError(result.errors[0] ?? '');

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      const next = prev.filter((item) => item.id !== id);
      if (next.length === 0 && attachmentInputRef.current) {
        attachmentInputRef.current.value = '';
      }
      return next;
    });
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!type || !content) {
      alert(t('message.incomplete'));
      return;
    }

    alert(t('message.success'));

    // 清空表单
    setType('');
    setContent('');
    setContact('');
    setAttachmentError('');
    setAttachments((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = '';
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-gray-50 dark:bg-[#2f2f2f]
        border border-gray-200 dark:border-gray-700
        rounded-xl
        p-6 md:p-8
        space-y-5
        shadow-sm
      "
    >
      {/* 投诉类型 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.type.label')}
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-[#3f3f3f]
            text-gray-900 dark:text-gray-100
            border border-gray-300 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent
            transition-all duration-200
          "
        >
          <option value="" disabled>
            {t('form.type.placeholder')}
          </option>
          <option value="bug">{t('form.type.bug')}</option>
          <option value="content">{t('form.type.content')}</option>
          <option value="experience">{t('form.type.experience')}</option>
          <option value="other">{t('form.type.other')}</option>
        </select>
      </div>

      {/* 投诉内容 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.content.label')}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder={t('form.content.placeholder')}
          className="
            w-full resize-none rounded-lg
            bg-white dark:bg-[#3f3f3f]
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            border border-gray-300 dark:border-gray-600
            p-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent
            transition-all duration-200
          "
        />
      </div>

      {/* 联系方式 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.contact.label')}
        </label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t('form.contact.placeholder')}
          className="
            w-full rounded-lg
            bg-white dark:bg-[#3f3f3f]
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            border border-gray-300 dark:border-gray-600
            p-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent
            transition-all duration-200
          "
        />
      </div>

      {/* 附件上传 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.attachment.label')}
        </label>
        <div
          className="
            w-full rounded-lg
            border-2 border-dashed border-gray-300 dark:border-gray-600
            bg-white dark:bg-[#3f3f3f]
            p-2.5
            space-y-3
            max-h-64 overflow-x-hidden overflow-y-auto
            transition-all duration-200
          "
        >
          <label
            htmlFor="attachment"
            className="
              flex flex-col items-center justify-center gap-2
              w-full min-h-24
              rounded-md
              border border-transparent
              cursor-pointer
              hover:border-[#10a37f] hover:bg-gray-50 dark:hover:bg-[#4a4a4a]
              transition-all duration-200
            "
          >
            <CloudArrowUpIcon className="w-7 h-7 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('form.attachment.text')}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {t('form.attachment.hint')}
            </span>
            <input
              ref={attachmentInputRef}
              id="attachment"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleAttachmentChange}
            />
          </label>
          {attachments.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {attachments.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#3f3f3f] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(item.id)}
                    className="absolute right-1 top-1 h-6 w-6 rounded-full bg-black/60 text-white text-sm leading-none hover:bg-black/80 transition"
                    aria-label={t('form.attachment.remove', { name: item.name })}
                    title={t('form.attachment.remove', { name: item.name })}
                  >
                    ×
                  </button>
                  <div className="h-14 w-full bg-gray-100 dark:bg-[#2f2f2f] flex items-center justify-center">
                    {item.isImage ? (
                      <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <CloudArrowUpIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300 truncate">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {attachmentError && (
          <p className="text-xs text-red-500 dark:text-red-400">{attachmentError}</p>
        )}
      </div>

      {/* 提交按钮 */}
      <div className="pt-2">
        <button
          type="submit"
          className="
            w-full flex items-center justify-center gap-2
            py-3 rounded-lg
            bg-[#10a37f] hover:bg-[#0d8a6a]
            text-white font-medium
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:ring-offset-2
          "
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          {t('form.submit')}
        </button>
      </div>
    </form>
  );
}
