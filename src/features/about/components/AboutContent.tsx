import { useTranslation } from 'react-i18next';

export default function AboutContent() {
  const { t } = useTranslation('about');

  const members = t('team.members', { returnObjects: true });

  const getTeamImage = (name: string): string => {
    const imageMap: { [key: string]: string } = {
      小雷: '/images/team/xiaolei.png',
      Xiaolei: '/images/team/xiaolei.png',
      'Tiểu Lôi': '/images/team/xiaolei.png',
      小高: '/images/team/xiaogao.JPG',
      Xiaogao: '/images/team/xiaogao.JPG',
      'Tiểu Cao': '/images/team/xiaogao.JPG',
      小朱: '/images/team/xiaozhu.png',
      Xiaozhu: '/images/team/xiaozhu.png',
      'Tiểu Trúc': '/images/team/xiaozhu.png',
      小晴: '/images/team/xiaoqing.png',
      Xiaoqing: '/images/team/xiaoqing.png',
      'Tiểu Tình': '/images/team/xiaoqing.png',
    };
    return imageMap[name] || '/images/team/default.png';
  };

  return (
    <main className="flex-1 text-slate-800 dark:text-slate-100">
      {/* 英雄区域 */}
      <section className="bg-slate-900 text-white py-16 text-center px-6">
        <h2 className="text-4xl font-bold mb-3">{t('hero.title')}</h2>
        <p className="max-w-3xl mx-auto text-lg text-slate-200">{t('hero.description')}</p>
      </section>

      {/* 关于我们 */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
          {t('aboutUs.title')}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12">
          {t('aboutUs.intro')}
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8">
          <h3 className="text-2xl font-semibold mb-4 text-center text-slate-900 dark:text-slate-100">
            {t('aboutUs.mission')}
          </h3>
          <p className="mb-4 leading-7 text-slate-700 dark:text-slate-300">
            {t('aboutUs.missionText1')}
          </p>
          <p className="leading-7 text-slate-700 dark:text-slate-300">
            {t('aboutUs.missionText2')}
          </p>
        </div>
      </section>

      {/* 团队成员 */}
      <section className="bg-slate-100 dark:bg-slate-900 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
          {t('team.title')}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12">{t('team.subtitle')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {members &&
            Array.isArray(members) &&
            members.map((m: any, idx: number) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition p-5 text-center"
              >
                {/* 成员照片 */}
                <img
                  src={getTeamImage(m.name)}
                  alt={m.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />

                {/* 成员信息 */}
                <h3 className="text-xl font-semibold">{m.name}</h3>
                <p className="text-rose-500 font-medium mt-1">{m.role}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">{m.desc}</p>
              </div>
            ))}
        </div>
      </section>

      {/* 项目介绍 */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
          {t('project.title')}
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12">
          {t('project.subtitle')}
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8 space-y-10">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-center">{t('project.features')}</h3>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
              {t('project.featuresDesc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">{t('project.coreFeatures')}</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                {(t('project.coreFeaturesList', { returnObjects: true }) as string[]).map(
                  (item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">{t('project.techHighlights')}</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                {(t('project.techHighlightsList', { returnObjects: true }) as string[]).map(
                  (item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 border-l-4 border-sky-400 dark:border-sky-500 p-5 rounded">
            <h4 className="font-semibold mb-2">{t('project.progress')}</h4>
            <p className="text-slate-700 dark:text-slate-300">{t('project.progressText')}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
