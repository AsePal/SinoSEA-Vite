import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ComplaintForm() {
  const { t } = useTranslation('complaint');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!type || !content) {
      alert(t('message.incomplete'));
      return;
    }

    // ✅ 这里后期直接接后端
    console.log({
      type,
      content,
      contact,
    });

    alert(t('message.success'));

    // 清空表单
    setType('');
    setContent('');
    setContact('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-black/30 backdrop-blur
        border border-white/10
        rounded-2xl
        p-8
        space-y-6 
      "
    >
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-6 ">
        <div className="p-2 rounded-lg bg-orange-500/20">
          <PencilSquareIcon className="w-6 h-6 text-orange-400" />
        </div>

        <h2 className="text-2xl font-bold text-orange-300">{t('form.title')}</h2>
      </div>

      {/*投诉类型*/}
      <div className="space-y-2">
        <label className="text-xl text-gray-200">{t('form.type.label')}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg
          bg-black/30 backdrop-blur text-orange-400
          border border-white/30 focus:outline-none
          focus:ring-2 focus:ring-orange-400 focus:border-orange-400
          transition
          "
        >
          <option value="" disabled className="bg-black/90 text-white/50">
            {t('form.type.placeholder')}
          </option>
          <option value="bug" className="bg-black/90 text-orange-400">
            {t('form.type.bug')}
          </option>
          <option value="content" className="bg-black/90 text-orange-400">
            {t('form.type.content')}
          </option>
          <option value="experience" className="bg-black/90 text-orange-400">
            {t('form.type.experience')}
          </option>
          <option value="other" className="bg-black/90 text-orange-400">
            {t('form.type.other')}
          </option>
        </select>
      </div>

      {/* 投诉内容 */}
      <div className="space-y-2">
        <label className="text-xl text-gray-200">{t('form.content.label')}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder={t('form.content.placeholder')}
          className="
            w-full resize-none
            rounded-lg
            bg-white/10
            p-3
            text-sm
            outline-none
            focus:ring-2 focus:ring-orange-400
          "
        />
      </div>

      {/* 联系方式 */}
      <div className="space-y-2">
        <label className="text-xl text-gray-200">{t('form.contact.label')}</label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t('form.contact.placeholder')}
          className="
            w-full rounded-lg
            bg-white/10
            p-3
            text-sm
            outline-none
            focus:ring-2 focus:ring-orange-400
          "
        />
      </div>

      {/*附件上传 */}
      <div className="space-y-2">
        <label className="text-xl text-gray-200">{t('form.attachment.label')}</label>

        <label
          htmlFor="attachment"
          className="
      flex flex-col items-center justify-center gap-3
      w-full h-32
      rounded-xl
      border-2 border-dashed border-orange-500/40
      bg-orange-500/10
      cursor-pointer
      hover:bg-orange-500/20
      transition
    "
        >
          <CloudArrowUpIcon className="w-8 h-8 text-orange-400" />

          <span className="text-sm text-orange-300">{t('form.attachment.text')}</span>

          <span className="text-xs text-gray-400">{t('form.attachment.hint')}</span>

          <input id="attachment" type="file" multiple className="hidden" />
        </label>
      </div>

      {/* 提交按钮 */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className=" w-full flex items-center justify-center gap-2
          py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-300
         text-black font-semibold hover:opacity-90 transition
          "
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          {t('form.submit')}
        </button>
      </div>
    </form>
  );
}
