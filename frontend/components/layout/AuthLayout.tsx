// frontend/components/layout/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string; // sr-only로 사용될 수 있음
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    // ✅ min-h-screen, 배경 그라데이션, p-6, font-gowun, text-gray-800 모두 제거.
    //    이 클래스들은 이제 MainLayout이 제공합니다.
    //    AuthLayout은 오직 flex items-center justify-center로 중앙 정렬 역할만 수행합니다.
    <div className="flex flex-col items-center justify-center flex-grow w-full"> {/* flex-grow와 w-full 추가 */}
      <h1 className="sr-only">{title}</h1> {/* 시각적으로 숨김 */}
      {children}
    </div>
  );
}