import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { apiRequest } from '../utils/apiConfig';
//纸飞机图标
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';



export default function Login() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  //用于“记住我”的控件
  const [rememberMe, setRememberMe] = useState(false);






  //密码查看事件
  const [showPassword, setShowPassword] = useState(false);
  //导航到引导页
  const navigate = useNavigate();
  //密码框聚焦
  const [passwordFocused, setPasswordFocused] = useState(false);
  //离场
  const [leaving, setLeaving] = useState(false);
  //纸飞机样式状态
  type LoginAnim = 'idle' | 'success' | 'error';

  const [loginAnim, setLoginAnim] = useState<LoginAnim>('idle');



  //键盘事件监听
  useEffect(() => {
    const handleKeyEvent = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
      window.removeEventListener('keyup', handleKeyEvent);
    };
  }, []);
  //读取已保存的账号信息
  useEffect(() => {
    const savedAccount = localStorage.getItem('remember_account');
    if (savedAccount) {
      setAccount(savedAccount);
      setRememberMe(true);
    }
  }, []);


  const clearError = () => {
    if (error) setError('');
  };

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
      //判断是否记住账号信息
      if (rememberMe) {
        localStorage.setItem('remember_account', account);
      } else {
        localStorage.removeItem('remember_account');
      }

      // ① 触发离场动画
      setLoginAnim('success');
      setLeaving(true);

      // ② 等动画完成再跳转
      setTimeout(() => {
        navigate('/chat');
      }, 350);
    } catch (e: any) {
      setError(e.message || '登录失败');
      setLoginAnim('error');

      // 震动结束后恢复
      setTimeout(() => {
        setLoginAnim('idle');
      }, 500);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden animate-fog-reveal">
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/login-bg2.jpg")' }}
      />

      {/* 轻度暗色遮罩（参考图是“背景清晰，卡片雾面”） */}
      <div className={`
        absolute inset-0 transition-colors duration-300
        ${leaving ? 'bg-black/40' : 'bg-black/50'}
      `}
      />

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-2xl px-4 ">
        <div
          className={` min-h-[600px] rounded-3xl bg-white/20 backdrop-blur-lg
          border border-white/30 shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          px-14 py-16 text-white
          transition-all duration-300 ease-in-out
          ${leaving ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'}
        `}
        >
          {/* 标题 */}
          <h1 className="text-3xl font-semibold tracking-wide mb-2 text-center">
            欢迎登录
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
            onFocus={clearError}
            onChange={(e) =>
              setAccount(e.currentTarget.value.replace(/\s/g, ''))
            }
          />
          {/* 密码 */}
          <div className="relative w-full mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              className=" w-full px-4 py-3 pr-12
              rounded-xl bg-white/20 text-white
             placeholder-white/60
             border border-white/30
             focus:outline-none
              focus:ring-2 focus:ring-white/40
             transition
            "
              placeholder="密码"
              value={password}
              onFocus={() => {
                clearError();
                setPasswordFocused(true);
              }}
              onBlur={() => setPasswordFocused(false)}
              onChange={(e) =>
                setPassword(e.currentTarget.value.replace(/\s/g, ''))
              }
            />

            {/* 👁️ 小眼睛：永远显示 */}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="
             absolute right-4 top-1/2 -translate-y-1/2
             text-white/60 hover:text-white
             transition
            "
              tabIndex={-1}
            >
              {showPassword ? '🧐' : '🙈'}
            </button>
          </div>

          {/* 错误提示占位区 */}
          <div className="min-h-[20px] mb-2 transition-opacity duration-200">
            {error && (
              <div className="text-red-300 text-sm opacity-100">
                {error}
              </div>
            )}
          </div>


          <div className="h-[20px] mb-3">
            <div
              className={` text-amber-300 text-sm transition-opacity duration-200
             ${passwordFocused && capsLockOn ? 'opacity-100' : 'opacity-0'}
            `}
            >
              ⚠️ 大写锁定已开启（Caps Lock）
            </div>
          </div>



          {/* 错误提示与操作区分隔线 */}
          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-white/25" />
          </div>



          {/* 主登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={loading || !agreed || loginAnim === 'success'}
            className={`
            relative w-full h-14 rounded-xl
            flex items-center justify-center gap-2
            text-lg font-medium
            transition
            overflow-hidden
            ${loginAnim === 'error' ? 'animate-shake' : ''}
            ${loading || !agreed
                ? 'bg-white/30 text-white/60 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-400 text-white'
              }
          `}
          >
            <span>{loading ? '登录中…' : '登录'}</span>

            {/* 纸飞机 */}
            <PaperAirplaneIcon
              className={`
              w-5 h-5 text-white
              transition-all duration-500 ease-in-out
               ${loginAnim === 'success'
                  ? 'translate-x-32 opacity-0 scale-90'
                  : 'translate-x-0 opacity-100 scale-100'
                }
              `}
            />
          </button>
          
          <div className='mt-4 space-y-2'>
            {/*记住我按钮选择控件*/}
            <label className="flex items-center gap-2 text-sm text-white/80 mb-4">
              <input
                type="checkbox"
                className="accent-white"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              记住我
            </label>
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

          {/* 错误提示与操作区分隔线 */}
          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-white/25" />
          </div>

          {/* 链接 */}
          <div className="flex justify-between text-sm text-white/70 mt-6">
            <Link to="/register" className="hover:text-white">
              用户注册
            </Link>
            <Link to="/reset-password" className="hover:text-white">
              忘记密码？
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
