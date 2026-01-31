import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const TermsOfUse = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('terms');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    document.title = t('pageTitle');
  }, [t]);

  // 监听滚动显示回到顶部按钮
  useEffect(() => {
    const scrollContainer = document.getElementById('app-scroll-container');

    const handleScroll = () => {
      if (scrollContainer) {
        setShowBackToTop(scrollContainer.scrollTop > 300);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById('app-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const today = new Date();
  // 根据语言格式化日期
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(today);

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* 返回按钮 */}
        <div className="mx-auto max-w-4xl w-full px-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>{t('backButton')}</span>
          </button>
        </div>

        {/* Main */}
        <main className="mx-auto max-w-4xl px-4 py-6">
          <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
            {/* Title */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 px-8 py-10 text-center text-white">
              <h1 className="text-2xl font-bold">{t('header.title')}</h1>
              <p className="mt-2 text-sm opacity-90">{t('header.subtitle')}</p>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 text-center text-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                {t('lastUpdated')}
                {formattedDate}
              </div>

              {/* Section 1 */}
              <Section title={t('sections.acceptance.title')}>
                {t('sections.acceptance.content')}
              </Section>

              <Section title={t('sections.description.title')}>
                <ul className="list-disc pl-5 space-y-2">
                  {(t('sections.description.items', { returnObjects: true }) as string[]).map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ul>

                <Highlight>{t('sections.description.highlight')}</Highlight>
              </Section>

              <Section title={t('sections.account.title')}>
                <ol className="list-decimal pl-5 space-y-2">
                  {(t('sections.account.items', { returnObjects: true }) as string[]).map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ol>
              </Section>

              <Section title={t('sections.acceptableUse.title')}>
                <ul className="list-disc pl-5 space-y-2">
                  {(t('sections.acceptableUse.items', { returnObjects: true }) as string[]).map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ul>
              </Section>

              <Section title={t('sections.privacy.title')}>
                {t('sections.privacy.content')}
                <span
                  onClick={() => navigate('/privacy')}
                  className="ml-1 cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {t('sections.privacy.link')}
                </span>
              </Section>

              <Section title={t('sections.intellectualProperty.title')}>
                {t('sections.intellectualProperty.content')}
              </Section>

              <Section title={t('sections.disclaimer.title')}>
                <ul className="list-disc pl-5 space-y-2">
                  {(t('sections.disclaimer.items', { returnObjects: true }) as string[]).map(
                    (item, idx) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ul>

                <Warning>{t('sections.disclaimer.warning')}</Warning>
              </Section>

              <Section title={t('sections.liability.title')}>
                {t('sections.liability.content')}
              </Section>

              <Section title={t('sections.changes.title')}>{t('sections.changes.content')}</Section>

              <Section title={t('sections.updates.title')}>{t('sections.updates.content')}</Section>

              <Section title={t('sections.contact.title')}>
                <ul className="space-y-1">
                  <li>{t('sections.contact.email')}</li>
                  <li>{t('sections.contact.phone')}</li>
                </ul>
              </Section>

              {/* Agreement */}
              <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-8 text-center">
                <h3 className="mb-6 font-semibold text-gray-900 dark:text-gray-100">
                  {t('agreement.title')}
                </h3>
                <button
                  onClick={() => navigate('/login')}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-3 text-white transition"
                >
                  <CheckCircleIcon className="h-6 w-6" />
                  {t('agreement.button')}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative mt-10">
          <div className="pointer-events-none absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 py-8 text-center text-sm text-gray-600 dark:text-white/80">
            {t('footer.copyright')}
            <p className="mt-1.5 text-xs opacity-80">{t('footer.font')}</p>
          </div>
        </footer>

        {/* 回到顶部按钮 */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-lg transition-all duration-300 hover:scale-110"
            aria-label={t('backToTop')}
          >
            <ArrowUpIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TermsOfUse;

/* ===== 子组件 ===== */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="mb-3 text-lg font-semibold text-indigo-700 dark:text-indigo-400 border-b border-gray-200 dark:border-gray-700 pb-2">
      {title}
    </h2>
    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-md border-l-4 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 p-4 text-sm text-indigo-800 dark:text-indigo-200">
    {children}
  </div>
);

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-md border-l-4 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 p-4 text-sm text-yellow-700 dark:text-yellow-200">
    {children}
  </div>
);
