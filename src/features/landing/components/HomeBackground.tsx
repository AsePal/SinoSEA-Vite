import type { ReactNode } from 'react';

export default function HomeBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景图片（清晰层） */}
      <div
        className="fixed inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/landingbg.avif')",
        }}
      />

      {/* 高斯模糊层（关键） */}
      <div
        className="fixed inset-0 z-[1] bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/images/landingbg.avif')",
          filter: 'blur(1px)',
          transform: 'scale(1.08)', // 防止 blur 边缘露白
          opacity: 0.6,
        }}
      />

      {/* 前景内容 */}
      <div className="relative z-20 min-h-screen">{children}</div>
    </div>
  );
}
