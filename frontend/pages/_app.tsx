// frontend/pages/_app.tsx (최종 버전)
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import MainLayout from '../components/layout/MainLayout';
import { useRouter } from 'next/router';

// AppContent 컴포넌트: SessionProvider 내부에서 useSession을 사용하여 레이아웃을 처리
function AppContent({ Component, pageProps }: AppProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  const userName = session?.user?.name || session?.user?.email || null;

  // MainLayout을 보여줄지 결정: 홈 페이지('/')만 제외.
  // 이제 로그인/회원가입 페이지도 MainLayout으로 감쌉니다.
  const shouldShowMainLayout = router.pathname !== '/';

  // ✅ Sidebar를 보여줄지 결정:
  //    홈 페이지, 로그인/회원가입 페이지, 시중 동화 상세 페이지(/library/[id]가 있다면)에서는 사이드바 숨김
  //    이제 /story/[id] (AI/내 동화 상세 페이지)에서는 사이드바가 보이도록 합니다.
  const shouldShowSidebar = shouldShowMainLayout && // MainLayout이 보여지는 경우에만 사이드바 고려
                            !['/login', '/signup'].includes(router.pathname) && // 로그인/회원가입 페이지 숨김
                            // !router.pathname.startsWith('/story/') && // ❌ 이 라인을 제거하여 AI/내 동화 상세 페이지에서 사이드바를 보이도록 합니다.
                            !router.pathname.startsWith('/library/'); // /library/[id] 상세 페이지 숨김 (시중 동화 상세 페이지가 있다면)

  return (
    <>
      {shouldShowMainLayout ? (
        <MainLayout userName={userName} showSidebar={shouldShowSidebar}>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        // 홈 페이지('/')일 경우 (MainLayout 없이)
        // Header는 pages/index.tsx에서 직접 렌더링됨
        <Component {...pageProps} />
      )}
    </>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppContent Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}