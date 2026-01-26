export default function Footer() {
  return (
    <footer className="relative mt-12">
      {/* 页脚遮罩 */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* 页脚内容 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 text-center text-white">
        <p className="text-sm opacity-90">© 2026 星洲智能助手 版权所有 | 校园智能助手服务平台</p>
        <p className="text-sm opacity-90">字体：MiSans</p>
      </div>
    </footer>
  );
}
