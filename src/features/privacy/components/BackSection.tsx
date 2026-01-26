import { useNavigate } from 'react-router-dom';

export default function BackSection() {
  const navigate = useNavigate();

  return (
    <div className="text-center bg-indigo-50 rounded-xl p-8">
      <h3 className="text-indigo-600 font-semibold mb-3">阅读完隐私政策后</h3>
      <button
        onClick={() => navigate('/login')}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition"
      >
        返回登录
      </button>
    </div>
  );
}
