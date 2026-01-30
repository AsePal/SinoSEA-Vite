import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { PolicySection, PolicyTable, BackSection, Footer } from '../components';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { t } = useTranslation('privacy');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.getElementById('app-scroll-container');
    setScrollEl(container);

    const target = container ?? window;
    const getScrollTop = () => (container ? container.scrollTop : window.scrollY);

    const handleScroll = () => {
      setShowScrollTop(getScrollTop() > 300);
    };

    handleScroll();
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/login');
  };

  const handleScrollTop = () => {
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const policySections = [
    {
      id: 'intro',
      title: t('sections.intro.title'),
      paragraphs: t('sections.intro.paragraphs', { returnObjects: true }) as string[],
    },
    {
      id: 'collect',
      title: t('sections.collect.title'),
      paragraphs: t('sections.collect.paragraphs', { returnObjects: true }) as string[],
      list: t('sections.collect.list', { returnObjects: true }) as string[],
      highlight: t('sections.collect.highlight'),
    },
  ];

  const usageTable = {
    title: t('usageTable.title'),
    headers: t('usageTable.headers', { returnObjects: true }) as string[],
    rows: t('usageTable.rows', { returnObjects: true }) as string[][],
  };

  const rightsTable = {
    title: t('rightsTable.title'),
    headers: t('rightsTable.headers', { returnObjects: true }) as string[],
    rows: t('rightsTable.rows', { returnObjects: true }) as string[][],
  };

  return (
    <div className="w-full min-h-full bg-gray-100 dark:bg-gray-900 relative">
      {/* 返回按钮区域 */}
      <div className="w-full bg-gray-100 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto w-full px-6 pt-6 pb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold transition shadow
              bg-white text-gray-700 border border-gray-200 hover:bg-gray-50
              dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t('backButton')}
          </button>
        </div>
      </div>

      {/* 页面内容 */}
      <div className="relative z-10">
        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* 最后更新日期 */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-indigo-500 dark:border-indigo-400 rounded px-6 py-4 mb-8 shadow">
            <span className="text-gray-900 dark:text-gray-100">{t('lastUpdated')}</span>
            <span className="text-indigo-600 dark:text-indigo-400 ml-2">
              {t('lastUpdatedDate')}
            </span>
          </div>

          {/* 条款主体 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
            {policySections.map((section) => (
              <PolicySection key={section.id} {...section} />
            ))}

            <PolicyTable {...usageTable} />
            <PolicyTable {...rightsTable} />

            <BackSection />
          </div>
        </main>

        <Footer />
      </div>

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-indigo-600/90 hover:bg-indigo-600 dark:bg-indigo-500/90 dark:hover:bg-indigo-500 text-white p-3 shadow-lg transition"
          aria-label={t('backToTop')}
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
