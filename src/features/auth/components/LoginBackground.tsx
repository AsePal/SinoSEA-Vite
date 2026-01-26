import type { ReactNode } from 'react';

export default function HomeBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className="
        min-h-screen text-white
        bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('/images/login-bg.avif')]
        bg-cover bg-center bg-fixed
      "
    >
      {children}
    </div>
  );
}
