// frontend/components/layout/Header.tsx (최종 버전, 마이페이지/로그아웃 테두리 반영)
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
  userName: string | null;
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center py-2 px-10 bg-white shadow-md border-b-2 border-pink-200">
      <h1 className="text-3xl font-bold text-pink-600 cursor-pointer hover:text-pink-700 transition" onClick={() => router.push("/")}>
        📖나만의 도서관
      </h1>
      <div className="text-md flex items-center gap-4">
        {session ? (
          <>
            <span className="text-gray-700 font-semibold text-lg">{userName}님 반갑습니다!</span>
            {/* ✅ 마이페이지 Link에 테두리 스타일 추가 */}
            <Link
              href="/mypage"
              className="px-3 py-1 border border-blue-400 rounded-md text-blue-500 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              마이페이지
            </Link>
            {/* ✅ 로그아웃 button에 테두리 스타일 추가 */}
            <button
              onClick={() => signOut()}
              className="px-3 py-1 border border-red-400 rounded-md text-red-500 font-semibold hover:bg-red-50 hover:text-red-600 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            {/* 비로그인 시 로그인/회원가입 버튼에는 테두리를 추가하지 않습니다. */}
            <Link href="/login" className="text-blue-500 hover:underline">
              로그인
            </Link>
            <Link href="/signup" className="text-green-500 hover:underline">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}