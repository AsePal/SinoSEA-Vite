import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TermsOfUse = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '使用条款 | 星洲智能助手';
  }, []);

  const today = new Date();
  const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <div className="w-full min-h-full relative">
      {/* 背景图层 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/public/images/login-bg.avif')" }}
      />
      {/* 只作用在背景上的遮罩 */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="relative z-10 flex min-h-full flex-col">
        {/* Main */}
        <main className="mx-auto max-w-4xl px-4 py-10">
          \n{' '}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Title */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 px-8 py-10 text-center text-white">
              <h1 className="text-2xl font-bold">星洲智能助手使用条款</h1>
              <p className="mt-2 text-sm opacity-90">
                使用本服务即表示您已阅读、理解并同意以下条款
              </p>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              <div className="mb-8 border-b pb-4 text-center text-sm text-gray-500 flex justify-center items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                最后更新日期：{formattedDate}
              </div>

              {/* Section */}
              <Section title="1. 接受条款">
                通过访问或使用星洲智能助手（以下简称“本服务”），您同意受本使用条款的约束。
                如果您不同意这些条款，请不要使用本服务。
              </Section>

              <Section title="2. 服务描述">
                <ul className="list-disc pl-5 space-y-2">
                  <li>学习助手：提供学习指导与答疑</li>
                  <li>心理咨询：提供心理健康支持（非医疗）</li>
                  <li>校园问答：解答学习与校园生活问题</li>
                  <li>校园社交功能（开发中）</li>
                </ul>

                <Highlight>
                  本服务所提供的建议仅供参考，不能替代医疗、法律或学术等专业意见。
                </Highlight>
              </Section>

              <Section title="3. 用户账户">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>提供真实、准确、完整的注册信息</li>
                  <li>妥善保管账户与密码</li>
                  <li>对账户下的所有活动负责</li>
                </ol>
              </Section>

              <Section title="4. 可接受使用政策">
                <ul className="list-disc pl-5 space-y-2">
                  <li>不得违反任何法律法规</li>
                  <li>不得传播违法、有害信息</li>
                  <li>不得攻击、破坏系统安全</li>
                  <li>不得侵犯他人合法权益</li>
                </ul>
              </Section>

              <Section title="5. 隐私政策">
                我们将依据隐私政策处理您的个人信息。
                <span
                  onClick={() => navigate('/privacy')}
                  className="ml-1 cursor-pointer text-indigo-600 hover:underline"
                >
                  查看隐私政策
                </span>
              </Section>

              <Section title="6. 知识产权">
                本服务中的所有内容均受法律保护，未经许可不得复制、传播或用于商业用途。
              </Section>

              <Section title="7. 免责声明">
                <ul className="list-disc pl-5 space-y-2">
                  <li>服务可能存在中断或错误</li>
                  <li>不保证内容完全准确或可靠</li>
                </ul>

                <Warning>AI 提供的内容仅作参考，用户需自行判断与承担风险。</Warning>
              </Section>

              <Section title="8. 责任限制">
                在法律允许的最大范围内，我们不对任何间接、附带、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据损失或其他无形损失。
              </Section>

              <Section title="9. 服务变更与终止">
                我们保留随时修改、暂停或终止本服务（或其任何部分）的权利，无需事先通知。如果我们终止本服务，我们将尽合理努力提前通知用户。。
              </Section>

              <Section title="10. 条款变更">
                我们可能会不时更新这些使用条款。我们将通过在本页面发布新版本并更新"最后更新日期"来通知您任何更改。继续使用本服务即表示您接受更新后的条款。
              </Section>

              <Section title="11. 联系方式">
                <ul className="space-y-1">
                  <li>邮箱：1769797300@qq.com</li>
                  <li>电话：+86 15107851770</li>
                </ul>
              </Section>

              {/* Agreement */}
              <div className="mt-10 rounded-xl border bg-gray-50 p-8 text-center">
                <h3 className="mb-6 font-semibold">我已阅读并理解上述使用条款</h3>
                <button
                  onClick={() => navigate('/login')}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
                >
                  <CheckCircleIcon className="h-12 w-12" />
                  返回登录页面
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}

        <footer className="relative mt-10">
          {/* Footer 背景遮罩 */}
          <div className="pointer-events-none absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="relative z-10 py-8 text-center text-sm text-white/80">
            © 2026 星洲智能助手 | 版权所有
            <p className="mt-1.5 text-10px opacity-80">字体：MiSans</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfUse;

/* ===== 子组件 ===== */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="mb-3 text-lg font-semibold text-indigo-700 border-b pb-2">{title}</h2>
    <div className="text-gray-700 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-md border-l-4 border-indigo-500 bg-indigo-50 p-4 text-sm">
    {children}
  </div>
);

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-700">
    {children}
  </div>
);
