import { useTranslation } from 'react-i18next';

export default function AboutFooter() {
  const { t } = useTranslation('about');

  return (
    <footer>
      <div className="h-12 bg-slate-700 dark:bg-slate-800 text-slate-300 dark:text-slate-400 flex items-center justify-center text-sm">
        {t('footer.copyright')}
      </div>
      <div className="h-5 bg-slate-700 dark:bg-slate-800 text-slate-300 dark:text-slate-400 flex items-center justify-center text-sm">
        {t('footer.disclaimer')}
      </div>
      <div className="h-5 bg-slate-700 dark:bg-slate-800 text-slate-300 dark:text-slate-400 flex items-center justify-center text-xs">
        {t('footer.font')}
      </div>
    </footer>
  );
}
