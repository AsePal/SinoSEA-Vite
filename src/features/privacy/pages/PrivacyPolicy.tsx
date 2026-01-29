import { PolicySection, PolicyTable, BackSection, Footer } from '../components';

import { lastUpdated, policySections, usageTable, rightsTable } from '../data/policyContent';

export default function PrivacyPolicy() {
  return (
    <div className="w-full min-h-full bg-gray-100 dark:bg-gray-900 relative">
      {/* 页面内容 */}
      <div className="relative z-10">
        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* 最后更新日期 */}
          <div className="bg-white dark:bg-gray-800 border-l-4 border-indigo-500 dark:border-indigo-400 rounded px-6 py-4 mb-8 shadow">
            <span className="text-gray-900 dark:text-gray-100">最后更新日期：</span>
            <span className="text-indigo-600 dark:text-indigo-400 ml-2">{lastUpdated}</span>
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
    </div>
  );
}
