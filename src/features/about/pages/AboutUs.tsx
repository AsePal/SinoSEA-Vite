import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import AboutContent from '../components/AboutContent';
import AboutFooter from '../components/AboutFooter';

export default function AboutUsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('about');
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
    navigate('/chat');
  };

  const handleScrollTop = () => {
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-slate-100 dark:bg-gray-900">
      <div className="w-full bg-slate-900">
        <div className="max-w-6xl mx-auto w-full px-6 pt-6 pb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold transition shadow
              bg-white/10 text-white border border-white/30 hover:bg-white/20"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t('header.back')}
          </button>
        </div>
      </div>
      <AboutContent />
      <AboutFooter />

      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white p-3 shadow-lg transition"
          aria-label={t('header.backToTop')}
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
