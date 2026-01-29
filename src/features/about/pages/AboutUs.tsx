import AboutContent from '../components/AboutContent';
import AboutFooter from '../components/AboutFooter';

export default function AboutUsPage() {
  return (
    <div className="w-full min-h-full flex flex-col bg-slate-100 dark:bg-gray-900">
      <AboutContent />
      <AboutFooter />
    </div>
  );
}
