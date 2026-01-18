import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AcademicCapIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const LOGIN_URL = 'https://www.sionsea-ai.cn/auth/qq/start?red=http://localhost:5173/chat';

export default function Login() {
  const [agreed, setAgreed] = useState(false);

  const handleLogin = () => {
    if (!agreed) return;
    window.location.href = LOGIN_URL;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/images/login-bg.avif")'
      }}
    >
      {/* 主卡片 */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center px-6 py-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CpuChipIcon className="w-9 h-9" />
            <h1 className="text-3xl font-bold tracking-wide">
              星洲智能助手
            </h1>
          </div>
          <p className="text-base opacity-90">
            智能校园服务解决方案
          </p>
        </div>

        {/* 内容区 */}
        <div className="px-6 py-8">
          {/* 标语 */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              智为渡舟，暖心为岸
            </h2>
            <p className="text-base text-gray-500">
              AI智能是帮助你渡过信息之海的舟
              <br/>
              而我们的关怀是永远等待你的港湾
            </p>
          </div>
          


          {/* 描述 */}
          <p className="text-center text-[14px] text-gray-600 leading-6 mb-7">
            专为校园环境设计的智能助手
            <br/>           
            帮助你解决学习、生活、心理等问题,让校园生活更加高效便捷。
          </p>

          {/* 登录按钮 */}
          <button
            disabled={!agreed}
            onClick={handleLogin}
            className={`
              group w-full flex items-center justify-center gap-2
              rounded-xl py-4 text-lg font-semibold
              transition-all

                ${
                  agreed
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <ArrowRightOnRectangleIcon className="w-9 h-7 stroke-[2.7]" />
              QQ 登录
            </button>

          {/* 条款 */}
          <label className="mt-6 flex items-start gap-3 text-[15px] text-gray-600 ...">

            <input
              type="checkbox"
              className="mt-1 accent-blue-500"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="leading-relaxed">
              我已阅读并同意
              <Link
               to = "/privacy"
               className='text-11px text-indigo-500 font-medium hover:text-indigo-500 hover:underline transition-colors'
              >
                《隐私条款》
              </Link>
              和
              <a
                href="/terms"
                className='text-11px text-indigo-500 font-medium hover:text-indigo-500 hover:underline transition-colors'
              >
                《使用条款》
              </a>
            </span>
          </label>

          {/* 功能区 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-center text-base font-semibold text-gray-700 mb-5">

              主要功能
            </h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Feature icon={AcademicCapIcon} text="学习助手" />
              <Feature icon={HeartIcon} text="心理咨询" />
              <Feature icon={QuestionMarkCircleIcon} text="问题解答" />
              <Feature icon={ChatBubbleLeftRightIcon} text="校园社交（敬请期待）" />
            </div>
          </div>
          {/* 页脚 */}
          <div className="bg-gray-50 text-center py-3 border-t border-gray-200">
            <p className="text-[12px] text-gray-400 leading-snug">
            © 2026 星洲智能助手 | 版权所有
          </p>
          <p className="text-[12px] text-gray-400 leading-snug">
          字体: Misans
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  text
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-3 px-2 text-gray-600">
      <Icon className="w-5 h-5 text-blue-500 mb-1" />
      <span className="text-center text-sm leading-snug">
        {text}
      </span>
    </div>
  );
}
