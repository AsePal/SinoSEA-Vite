import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CpuChipIcon,
  AcademicCapIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import API from '../utils/apiConfig';

const MOCK_SMS_CODE = '143323';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 短信验证码倒计时
  const [countdown, setCountdown] = useState(0);

  /** 模拟发送验证码 */
  const handleSendCode = () => {
    if (!phone) {
      setError('请输入手机号');
      return;
    }

    setError('');
    setCountdown(60); // 启动 60 秒倒计时
  };

  /** 倒计时逻辑 */
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /** 注册提交 */
  const handleRegister = async () => {
    if (!agreed) {
      setError('请先阅读并同意相关条款');
      return;
    }

    if (!name || !phone || !smsCode || !password || !confirmPassword) {
      setError('请填写完整信息');
      return;
    }

    if (password.length < 8) {
      setError('密码长度不能少于 8 位');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (smsCode !== MOCK_SMS_CODE) {
      setError('短信验证码错误');
      return;
    }


    setLoading(true);
    setError('');

    try {
      const res = await fetch(API.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          phone: phone,
          password: password,
        }),
      });

      if (res.status === 409) {
        throw new Error('用户已存在');
      }

      if (!res.ok) {
        throw new Error('注册失败，请稍后重试');
      }
      if (
        /\s/.test(name) ||
        /\s/.test(phone) ||
        /\s/.test(smsCode) ||
        /\s/.test(password) ||
        /\s/.test(confirmPassword)
      ) {
        setError('输入内容不能包含空格');
        return;
      }


      // 注册成功 → 返回登录页
      navigate('/login');
    } catch (e: any) {
      setError(e.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-cover bg-cente"
      style={{ backgroundImage: 'url("/images/login-bg.avif")' }}
    >
      <div className="w-full max-w-5xl h-[590px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* 左侧介绍区 */}
        <div
          className="relative hidden md:flex flex-col justify-center px-10 text-white"
          style={{
            backgroundImage: 'url("/images/login-bg.avif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/*左侧遮罩 */}
          <div className="absolute inset-0 bg-blue-600/40" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <CpuChipIcon className="w-10 h-10" />
              <h1 className="text-3xl font-bold">SionSEA-AI</h1>
            </div>

            <p className="text-base leading-relaxed opacity-90">
              创建你的专属账号
              <br />
              加入智能校园服务体系
              <br />
              开启更高效、更温暖的校园体验
            </p>

            <div className="mt-10  grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Feature icon={AcademicCapIcon} text="学习助手" />
              <Feature icon={HeartIcon} text="心理咨询" />
              <Feature icon={QuestionMarkCircleIcon} text="问题解答" />
              <Feature icon={ChatBubbleLeftRightIcon} text="校园社交" />
            </div>
          </div>
        </div>

        {/* 右侧注册表单 */}
        <div className="flex flex-col justify-center px-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            用户注册
          </h2>
          <p className="text-gray-500 mb-6">
            使用手机号完成注册
          </p>

          <input
            className="w-full mb-3 px-4 py-3 border rounded-lg"
            placeholder="昵称 / 名称"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value.replace(/\s/g, ''));

            }}
          />

          <input
            className="w-full mb-3 px-4 py-3 border rounded-lg"
            placeholder="手机号"
            value={phone}
            onChange={(e) => {
              setPhone(e.currentTarget.value.replace(/\s/g, ''));
              
            }}
          />

          {/* 短信验证码 */}
          <div className="flex gap-3 mb-3">
            <input
              className="flex-1 px-4 py-3 border rounded-lg"
              placeholder="短信验证码"
              value={smsCode}
              onChange={(e) => {
                setSmsCode(e.currentTarget.value.replace(/\s/g, ''));
                
              }}
            />
            <button
              type="button"
              disabled={countdown > 0}
              onClick={handleSendCode}
              className={`
                px-4 rounded-lg text-sm
                ${countdown > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
              `}
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </button>
          </div>

          <input
            type="password"
            className="w-full mb-3 px-4 py-3 border rounded-lg tracking-normal"
            placeholder="密码（不少于 8 位）"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value.replace(/\s/g, ''));
              
            }}
          />

          <input
            type="password"
            className="w-full mb-3 px-4 py-3 border rounded-lg tracking-normal"
            placeholder="确认密码"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.currentTarget.value.replace(/\s/g, ''));
              
            }}
          />

          {error && (
            <div className="text-red-500 text-sm mb-3">
              {error}
            </div>
          )}

          <button
            disabled={loading || !agreed}
            onClick={handleRegister}
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
            {loading ? '注册中...' : '完成注册'}
          </button>

          <label className="mt-5 flex items-start gap-3 text-sm text-gray-600">
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

          <div className="mt-4 text-sm text-center text-gray-600">
            已有账号？
            <Link to="/login" className="text-blue-600 ml-1">
              去登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }: any) {
  return (
    <div className="flex flex-col items-center bg-white/10 rounded-lg py-3 px-2">
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
