import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('privacy');

  return (
    <footer className="relative mt-12">
      {/* 页脚遮罩 */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-sm" />

      {/* 页脚内容 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 text-center text-gray-700 dark:text-gray-300">
        <p className="text-sm opacity-90">{t('footer.copyright')}</p>
        <p className="text-sm opacity-90">{t('footer.font')}</p>
      </div>
    </footer>
  );
}
