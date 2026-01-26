import type { ReactNode } from 'react';

export default function HomeBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景渐变层 */}
      <div
        className="
          fixed inset-0 z-0
          bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.18),transparent),
              radial-gradient(1000px_500px_at_80%_110%,rgba(147,197,253,0.18),transparent),
              linear-gradient(180deg,#f8fbff,#ffffff)]
        "
      />

      {/* 极轻雾层，统一质感 */}
      <div
        className="
          fixed inset-0 z-10
          bg-white/10
          backdrop-blur-[2px]
        "
      />

      {/* 前景内容 */}
      <div className="relative z-20 min-h-screen">{children}</div>
    </div>
  );
}
