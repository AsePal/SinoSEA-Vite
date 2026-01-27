import type { ReactNode } from 'react';

export default function HomeBackground({ children }: { children: ReactNode }) {
  return (
    <>
      {/* 背景图片（基础层，清晰） */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/login-bg2.webp')",
        }}
      />

      {/* 全局渐变遮罩（决定整体氛围，重点） */}
      <div
        className="
          fixed inset-0 z-[1]
          bg-gradient-to-b
          from-white/50
          via-white/30
          to-white/20
        "
      />

      {/* 轻雾化层（可选：只做柔化，不当主效果） */}
      <div
        className="fixed inset-0 z-[2]"
        style={{
          backdropFilter: 'blur(2px)', // 👈 轻微即可，可调
        }}
      />

      {/* 前景应用画布（不再参与背景逻辑） */}
      <div className="relative z-10 h-screen w-screen overflow-hidden">{children}</div>
    </>
  );
}
