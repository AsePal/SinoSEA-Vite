import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { apiRequest } from '../utils/apiConfig';

export default function Login() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (/\s/.test(account) || /\s/.test(password)) {
      setError('账号或密码不能包含空格');
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

      if (res.status === 401) throw new Error('用户名或密码错误');
      if (!res.ok) throw new Error('登录失败，请稍后重试');

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/login-bg.avif")' }}
      />

      {/* 轻度暗色遮罩（参考图是“背景清晰，卡片雾面”） */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-2xl px-4 ">
        <div
          className=" min-h-[570px] rounded-3xl bg-white/20 backdrop-blur-lg
            border border-white/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)] px-14 py-16 text-white
          "
        >
          {/* 标题 */}
          <h1 className="text-3xl font-semibold tracking-wide mb-2 text-center">
            星洲智能助手
          </h1>
          <p className="text-base text-white/70 mb-10 text-center">
            校园智能助手服务平台
          </p>

          {/* 账号 */}
          <input
            className="
              w-full mb-4 px-4 py-3
              rounded-xl
              bg-white/20
              text-white
              placeholder-white/60
              border border-white/30
              focus:outline-none
              focus:ring-2 focus:ring-white/40
              transition
            "
            placeholder="手机号 / 用户名"
            value={account}
            onChange={(e) =>
              setAccount(e.currentTarget.value.replace(/\s/g, ''))
            }
          />
          {/* 密码 */}
          <input
            type="password"
            className="
              w-full mb-2 px-4 py-3
              rounded-xl
              bg-white/20
              text-white
              placeholder-white/60
              border border-white/30
              focus:outline-none
              focus:ring-2 focus:ring-white/40
              transition
            "
            placeholder="密码"
            value={password}
            onChange={(e) =>
              setPassword(e.currentTarget.value.replace(/\s/g, ''))
            }
            onKeyUp={(e) => setCapsLockOn(e.getModifierState('CapsLock'))}
          />
          {/* 错误提示占位区 */}
          <div className="min-h-[20px] mb-2 transition-opacity duration-200">
            {error && (
              <div className="text-red-300 text-sm opacity-100">
                {error}
              </div>
            )}
          </div>

          {capsLockOn && (
            <div className="text-amber-300 text-sm mb-3">
              ⚠️ 大写锁定已开启（Caps Lock）
            </div>
          )}
          {/* 分隔线 */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-white/20" />
          </div>


          {/* 主登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={loading || !agreed}
            className={`
              w-full h-14 rounded-xl
              text-lg font-medium
              transition
              ${loading || !agreed
                ? 'bg-white/30 text-white/60 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white'
              }
            `}
          >
            {loading ? '登录中…' : '登录'}
          </button>

          {/* 链接 */}
          <div className="flex justify-between mt-6 text-sm text-white/80">
            <Link to="/register" className="hover:text-white">
              用户注册
            </Link>
            <Link to="/reset-password" className="hover:text-white">
              忘记密码？
            </Link>
          </div>

          {/* 条款 */}
          <label className="mt-6 flex items-start gap-2 text-xs text-white/70">
            <input
              type="checkbox"
              className="mt-1 accent-white"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              我已阅读并同意
              <Link to="/privacy" className="underline ml-1 text-blue-300">
                《隐私条款》
              </Link>
              和
              <Link to="/terms" className="underline ml-1 text-blue-300">
                《使用条款》
              </Link>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
