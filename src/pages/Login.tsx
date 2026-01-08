import { useState } from 'react';
import {
  AcademicCapIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const LOGIN_URL = 'http://localhost:3000/auth/qq/start';

export default function Login() {
  const [agreed, setAgreed] = useState(false);

  const handleLogin = () => {
    window.location.href = LOGIN_URL;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url("/images/login-bg.webp")'
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-center p-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CpuChipIcon className="w-9 h-9" />
            <h1 className="text-2xl font-bold">星洲智能助手</h1>
          </div>
          <p className="text-sm opacity-90">您的专属校园 AI 助手</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-center mb-2">校园智能助手</h2>
          <p className="text-center text-gray-500 text-sm mb-6">一站式校园生活解决方案</p>

          <p className="text-gray-600 text-sm leading-relaxed text-center mb-8">
            星洲智能助手专为校园环境设计，帮助你解决学习、生活、
            <br />
            社交等问题，让校园生活更高效、更轻松。
          </p>

          {/* Login Button */}
          <button
            disabled={!agreed}
            onClick={handleLogin}
            className={`
              w-full flex items-center justify-center gap-2
              rounded-lg py-3 text-lg font-semibold transition
              ${
                agreed
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            点击此处登录
          </button>

          {/* Agreement */}
          <label className="mt-6 flex gap-3 items-start text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border">
            <input
              type="checkbox"
              className="mt-1 accent-blue-500"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              我已阅读并同意
              <a href="/privacy" className="text-blue-500 font-medium mx-1 hover:underline">
                《隐私条款》
              </a>
              和
              <a href="/terms" className="text-blue-500 font-medium mx-1 hover:underline">
                《使用条款》
              </a>
            </span>
          </label>

          {/* Features */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-center font-medium mb-4">主要功能</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <Feature icon={AcademicCapIcon} text="学习助手" />
              <Feature icon={HeartIcon} text="心理咨询" />
              <Feature icon={QuestionMarkCircleIcon} text="问题解答" />
              <Feature icon={ChatBubbleLeftRightIcon} text="校园社交（敬请期待）" />
            </div>
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
    <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg py-3">
      <Icon className="w-5 h-5 text-blue-500 mb-1" />
      <span className="text-center">{text}</span>
    </div>
  );
}
