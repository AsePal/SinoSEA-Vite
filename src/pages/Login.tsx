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
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';


export default function Login() {
  const [agreed, setAgreed] = useState(false);
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          identifier: account, // 👈 对应手机号 / 用户名
          password: password,
        }),

      });

      if (res.status === 401) {
        throw new Error('用户名或密码错误');
      }

      if (!res.ok) {
        throw new Error('登录失败，请稍后重试');
      }


      window.location.href = '/chat';
    } catch (e: any) {
      setError(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/images/login-bg.avif")'
      }}
    >
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
            让技术，终于抵达人心
          </p>
        </div>
        {/* 标语 */}
        <div className="text-center mt-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            智能校园服务解决方案
          </h2>
          <p className="text-base text-gray-500">
            专为校园环境设计的智能助手
            <br />
            帮助你解决学习、生活、心理等问题，
          让校园生活更加高效便捷。
          </p>
        </div>

        <div className="px-6 pt-10 pb-8">
          {/* 账号输入 */}
          <input
            className="w-full mb-4 px-4 py-3 border rounded-lg"
            placeholder="手机号 / 用户名"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />

          {/* 密码输入 */}
          <input
            type="password"
            className="w-full mb-3 px-4 py-3 border rounded-lg"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-500 text-sm mb-3">
              {error}
            </div>
          )}

          {/* 登录按钮 */}
          <button
            disabled={loading || !agreed}
            onClick={handleLogin}
            className={` w-full flex items-center justify-center gap-2
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
          <label className="mt-6 flex items-start gap-3 text-[15px] text-gray-600">
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

          {/* 功能区保持不变 */}
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
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }: any) {
  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-lg py-3 px-2 text-gray-600">
      <Icon className="w-5 h-5 text-blue-500 mb-1" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
