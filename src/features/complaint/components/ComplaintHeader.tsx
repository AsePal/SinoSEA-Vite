import { useTranslation } from 'react-i18next';

export default function ComplaintHeader() {
  const { t } = useTranslation('complaint');

  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {t('header.title')}
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {t('header.description')}
      </p>

      <p className="text-xs text-gray-400 dark:text-gray-500">{t('header.privacy')}</p>
    </div>
  );
}
