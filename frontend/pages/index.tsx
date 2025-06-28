// frontend/pages/index.tsx (최종 버전, 세로 간격 조정 반영)
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "../components/ui/Button";
import Image from "next/image";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";


const mainMenuItems = [
  { name: "도서관", path: "/library", icon: "/images/main-icons/book-shelf.png" },
  { name: "AI 창작 동화", path: "/story", icon: "/images/main-icons/magic-wand.png" },
  { name: "내 동화/녹음", path: "/mypage", icon: "/images/main-icons/microphone-book.png" },
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const backgroundImage = session
    ? "url('/images/bookshelf-bg.jpg')"
    : "url('/images/kids-library-bg.jpg')";

  const backgroundClasses = "bg-contain bg-no-repeat bg-center bg-fixed";

  return (
    <div className={`min-h-screen flex flex-col text-gray-800 font-gowun ${backgroundClasses}`} style={{ backgroundImage }}>
      {!session ? (
        // 비로그인 시 메인 페이지
        <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-40">
          <h1 className="text-6xl font-extrabold text-center text-purple-200 drop-shadow-lg mb-8">
            나만의 도서관
          </h1>
          <p className="text-xl text-center text-white mt-8 mb-10 p-4 bg-gray-800 bg-opacity-60 rounded-lg max-w-3xl leading-relaxed shadow-lg">
            아이들의 상상력을 키우는 마법 같은 동화 세상! <br />
            AI가 만들어주는 새로운 이야기, 직접 녹음하는 나만의 동화책, <br />
            다양한 시중 동화를 한 곳에서 만나보세요!
          </p>
          <div className="flex gap-6 mt-8">
            <Button onClick={() => router.push("/login")} primary>로그인</Button>
            <Button onClick={() => router.push("/signup")} secondary>회원가입</Button>
          </div>
        </div>
      ) : (
        // 로그인 시 메인 페이지
        <>
          <Header userName={session.user?.name || session.user?.email} />
          <div className="flex flex-col items-center justify-center flex-grow p-6">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-center text-purple-800 drop-shadow-lg mt-8 mb-12 w-full max-w-5xl tracking-widest"> {/* ✅ mt-16 -> mt-8, mb-20 -> mb-12로 조정 */}
              나만의 도서관
            </h1>

            <div className="flex flex-wrap justify-center items-center
                            gap-6 md:gap-10 lg:gap-16 xl:gap-20
                            mt-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 /* ✅ mt-10 -> mt-8로 조정 */
                            max-w-full overflow-hidden">
              {mainMenuItems.map((item) => (
                <Link href={item.path} key={item.name} className="block flex-shrink-0">
                  <div className="
                    w-56 h-44
                    sm:w-64 sm:h-48
                    md:w-72 md:h-56
                    lg:w-80 lg:h-60
                    xl:w-96 xl:h-64
                    bg-white bg-opacity-85 rounded-[80px]
                    shadow-2xl hover:shadow-3xl
                    transform hover:scale-105 transition-all duration-300
                    flex flex-col items-center justify-center text-center
                    border-6 border-purple-400 hover:border-purple-600
                    p-6
                  ">
                    <div className="w-24 h-24 flex items-center justify-center rounded-lg bg-gray-100 mb-3 overflow-hidden">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={90}
                        height={90}
                        objectFit="cover"
                        className=""
                      />
                    </div>
                    <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-purple-700 leading-tight">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}