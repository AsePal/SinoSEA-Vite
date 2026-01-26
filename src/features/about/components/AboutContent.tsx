export default function AboutContent() {
  const members = [
    {
      name: '小雷',
      role: '团队负责人 / 后端开发',
      desc: '负责项目的整体规划与后端框架搭建。',
      avatar: '../public/images/team/xiaolei.png',
    },
    {
      name: '小高',
      role: '前端开发 / 核心逻辑设计',
      desc: '负责项目核心交互设计与前端开发。',
      avatar: '../public/images/team/xiaogao.jpg',
    },
    {
      name: '小朱',
      role: '数据分析与采集',
      desc: '负责项目数据收集与分析处理。',
      avatar: '../public/images/team/xiaozhu.png',
    },
    {
      name: '小晴',
      role: 'UI 设计',
      desc: '负责项目整体视觉与 UI 设计。',
      avatar: '../public/images/team/xiaoqing.png',
    },
  ];

  return (
    <main className="flex-1 text-slate-800">
      {/* 英雄区域 */}
      <section className="bg-slate-900 text-white py-16 text-center px-6">
        <h2 className="text-4xl font-bold mb-3">智为渡舟，暖心为岸</h2>
        <p className="max-w-3xl mx-auto text-lg text-slate-200">
          AI智能是帮助你渡过信息之海的舟，而我们的关怀是永远等待你的港湾
        </p>
      </section>

      {/* 关于我们 */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900">关于我们</h2>
        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-12">
          我们是一支来自计应专业背景的学生团队，因对人工智能和校园服务的共同兴趣而聚集在一起，
          致力于开发解决校园实际问题的智能应用。
        </p>

        <div className="bg-white rounded-xl shadow p-8">
          <h3 className="text-2xl font-semibold mb-4 text-center text-slate-900">我们的使命</h3>
          <p className="mb-4 leading-7">
            通过技术创新，为师生提供更加智能、便捷的校园服务体验。
            我们相信技术应该服务于人，而校园正是技术应用的理想场所。
          </p>
          <p className="leading-7">
            我们的智能助手项目旨在整合校园资源，提供规则查询、心理疏导、
            自然语言交流、校园周边推荐等一站式服务，让校园生活更加高效、有序。
          </p>
        </div>
      </section>

      {/* 团队成员 */}
      <section className="bg-slate-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900">团队成员</h2>
        <p className="text-center text-slate-600 mb-12">
          我们团队的每位成员都拥有独特的技能和专长，共同推动项目的开发与实施
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {members.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 text-center"
            >
              {/* 成员照片 */}
              <img
                src={m.avatar}
                alt={m.name}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />

              {/* 成员信息 */}
              <h3 className="text-xl font-semibold">{m.name}</h3>
              <p className="text-rose-500 font-medium mt-1">{m.role}</p>
              <p className="text-slate-600 text-sm mt-3">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 项目介绍 */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900">项目介绍</h2>
        <p className="text-center text-slate-600 mb-12">
          校园智能助手是一款集多种功能于一体的 Web 应用，旨在提升校园生活的智能化水平
        </p>

        <div className="bg-white rounded-xl shadow p-8 space-y-10">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-center">校园智能助手功能特点</h3>
            <p className="text-center text-slate-600 mb-6">
              我们的应用整合了校园学习、生活、社交等多方面需求，通过智能化的方式提供一站式服务。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">核心功能</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>规章制度在线解答</li>
                <li>校园周边个性化推荐</li>
                <li>24小时在线的心理咨询模型</li>
                <li>多语言问答智能助手</li>
                <li>网页多端交互体验</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">技术亮点</h4>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>基于深度学习的推荐算法</li>
                <li>自然语言处理问答系统</li>
                <li>微服务架构后端系统</li>
                <li>响应式跨平台前端设计</li>
                <li>更符合东盟留学生的智能助手</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border-l-4 border-sky-400 p-5 rounded">
            <h4 className="font-semibold mb-2">项目进展</h4>
            <p className="text-slate-700">
              第一版已完成多语言与核心模型训练并上线运营。
              <br />
              第二版正在开发网页聊天室、微信小程序与移动端 App， 预计后半年开启内测阶段。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
