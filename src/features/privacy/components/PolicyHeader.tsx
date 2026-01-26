import { useNavigate } from 'react-router-dom'

export default function PolicyHeader() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
      <div className="max-w-5xl mx-auto px-6 py-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute right-6 top-6 flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded hover:bg-white/30"
        >
          ← 返回
        </button>

        <h1 className="text-2xl font-bold text-center">
          星洲智能助手隐私政策
        </h1>
        <p className="text-center text-white/90 mt-2 text-sm">
          我们致力于保护您的个人信息安全
        </p>
      </div>
    </header>
  )
}
