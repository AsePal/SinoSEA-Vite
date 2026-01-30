import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BackSection() {
  const navigate = useNavigate();
  const { t } = useTranslation('privacy');

  return (
    <div className="text-center bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-8">
      <h3 className="text-indigo-600 dark:text-indigo-400 font-semibold mb-3">
        {t('afterReading')}
      </h3>
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-3 text-white font-medium transition"
      >
        {t('backToLogin')}
      </button>
    </div>
  );
}
