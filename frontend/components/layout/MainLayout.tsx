// frontend/components/layout/MainLayout.tsx (최종 버전)
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  userName: string | null;
  showSidebar?: boolean;
}

export default function MainLayout({ children, userName, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-gowun bg-gradient-to-br from-[#FDF0FF] via-[#FDF3E6] to-[#FFe4e1]">
      <Header userName={userName} />
      <div className="flex flex-grow">
        {showSidebar && <Sidebar />}
        <main className={`flex-grow p-4 md:p-8 flex flex-col items-center ${showSidebar ? 'ml-0 md:ml-64' : 'ml-0'}`}>
          {children} {/* 이 children이 각 페이지의 콘텐츠입니다. */}
        </main>
      </div>
      <Footer />
    </div>
  );
}