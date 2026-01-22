import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { apiRequest } from '../utils/apiConfig';

import {
  AcademicCapIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';



export default function Login() {
  const [agreed, setAgreed] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //大写锁定判断
  const [capsLockOn, setCapsLockOn] = useState(false);

  const navigate = useNavigate();




  const handleLogin = async () => {
  if (!agreed) {
    setError('请先阅读并同意相关条款');
    return;
  }

  if (!account || !password) {
    setError('请输入账号和密码');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const res = await apiRequest(API.auth.login, {
      method: 'POST',
      body: {
        identifier: account,
        password,
      },
    });

    if (res.status === 401) {
      throw new Error('用户名或密码错误');
    }

    if (!res.ok) {
      throw new Error('登录失败，请稍后重试');
    }

    const data = await res.json();
    localStorage.setItem('auth_token', data.accessToken);

    navigate('/chat');
  } catch (e: any) {
    setError(e.message || '登录失败');
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: 'url("/images/login-bg.avif")' }}
    >
      {/* 主卡片 */}
      <div className="w-full max-w-5xl bg-white rounded-2xl h-[590px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ================= 左侧：项目介绍 ================= */}
        <div
          className="relative hidden md:flex flex-col justify-center px-10 text-white"
          style={{
            backgroundImage: 'url("/images/login-bg.avif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-blue-600/40" />

          {/* 内容 */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <CpuChipIcon className="w-10 h-10" />
              <h1 className="text-3xl font-bold">SionSEA-AI</h1>
            </div>

            <h2 className="text-xl font-semibold mb-4">
              智能校园服务解决方案
            </h2>

            <p className="text-base leading-relaxed opacity-90">
              智为渡舟，暖心为岸
              <br />
              专为校园环境设计的智能助手
              <br />
              帮助你解决学习、生活、心理等问题，
              <br />
              让校园生活更加高效便捷。
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
              <Feature icon={AcademicCapIcon} text="学习助手" />
              <Feature icon={HeartIcon} text="心理咨询" />
              <Feature icon={QuestionMarkCircleIcon} text="问题解答" />
              <Feature icon={ChatBubbleLeftRightIcon} text="校园社交" />
            </div>
          </div>
        </div>

        {/* ================= 右侧：登录表单 ================= */}
        <div className="flex flex-col justify-center px-8 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            欢迎登录
          </h2>
          <p className="text-gray-500 mb-6">
            使用手机号或用户名登录系统
          </p>

          {/* 分隔线 */}
          <div className="mb-6 flex justify-center">
            <div className="h-px w-50 bg-gray-300" />
          </div>

          {/* 账号 */}
          <input
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="手机号 / 用户名"
            value={account}
            onChange={(e) => setAccount(e.target.value)}

          />


          {/* 密码 */}
          <input
            type="password"
            className=" w-full mb-3 px-4 py-3 border rounded-lg tracking-normal
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
              setCapsLockOn(e.getModifierState('CapsLock'));
            }}
          />
          {capsLockOn && (
            <div className="text-amber-600 text-sm mb-3 flex items-center gap-1">
              <span>⚠️</span>
              <span>大写锁定已开启（Caps Lock）</span>
            </div>
          )}


          {error && (
            <div className="text-red-500 text-sm mb-3">
              {error}
            </div>
          )}



          {/* 登录按钮 */}
          <button
            disabled={loading || !agreed}
            onClick={handleLogin}
            className={`
              w-full flex items-center justify-center gap-2
              rounded-xl py-4 text-lg font-semibold transition-all
              ${loading || !agreed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg'
              }
            `}
          >
            <PaperAirplaneIcon className="w-6 h-6" />
            {loading ? '登录中...' : '账号登录'}
          </button>


          {/* 注册 / 忘记密码 */}
          <div className="flex justify-between mt-4 text-sm text-blue-600">
            <Link to="/register">用户注册</Link>
            <Link to="/reset-password">忘记密码？</Link>
          </div>

          {/* 条款 */}
          <label className="mt-6 flex items-start gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mt-1 accent-blue-500"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              我已阅读并同意
              <Link to="/privacy" className="text-indigo-500 ml-1">
                《隐私条款》
              </Link>
              和
              <Link to="/terms" className="text-indigo-500 ml-1">
                《使用条款》
              </Link>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* 功能卡片 */
function Feature({
  icon: Icon,
  text
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center bg-white/20 rounded-lg py-3 px-2">
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
