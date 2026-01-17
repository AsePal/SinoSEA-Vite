import {
  PolicyHeader,
  PolicySection,
  PolicyTable,
  BackSection,
  Footer
} from '../PrivacyPolicy'

import {
  lastUpdated,
  policySections,
  usageTable,
  rightsTable
} from '../PrivacyPolicy/data/policyContent'

export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/public/images/login-bg.webp')" }}
    >
      {/* 背景遮罩（等价于原 HTML 的 linear-gradient） */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 页面内容 */}
      <div className="relative z-10">
        <PolicyHeader />

        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* 最后更新日期 */}
          <div className="bg-white/95 backdrop-blur border-l-4 border-indigo-500 rounded px-6 py-4 mb-8 shadow">
            最后更新日期：
            <span className="text-indigo-600 ml-2">{lastUpdated}</span>
          </div>

          {/* 条款主体 */}
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-xl p-8">
            {policySections.map(section => (
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
  )
}
