import { useTranslation } from 'react-i18next';

export default function ComplaintHeader() {
  const { t } = useTranslation('complaint');

  return (
    <div className="text-center space-y-3">
      <h1
        className="
        text-3xl font-bold
        bg-gradient-to-r from-orange-400 to-yellow-300
        bg-clip-text text-transparent
      "
      >
        {t('header.title')}
      </h1>

      <p className="text-gray-300"></p>

      <p className="text-gray-400 text-10px leading-relaxed">{t('header.description')}</p>

      <p className="text-gray-400 text-10px leading-relaxed">{t('header.privacy')}</p>
    </div>
  );
}
