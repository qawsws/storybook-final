// frontend/components/layout/Sidebar.tsx (최종 버전)
import Link from 'next/link';
import { FaBook, FaMagic, FaMicrophone, FaHome } from 'react-icons/fa'; // 예시 아이콘

export default function Sidebar() {
  const navItems = [
    { name: "홈으로", path: "/", icon: <FaHome /> },
    { name: "도서관", path: "/library", icon: <FaBook /> },
    { name: "AI 동화 창작", path: "/story", icon: <FaMagic /> },
    { name: "내 동화/녹음 관리", path: "/mypage", icon: <FaMicrophone /> },
  ];

  return (
    <aside className="
      w-64 bg-[#e0f7fa] p-6 shadow-lg border-r-2 border-blue-200
      flex flex-col items-center pt-10
      flex-shrink-0 // 사이드바가 줄어들지 않도록 명시
    ">
      <nav className="w-full">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path} className="flex items-center gap-3 p-3 rounded-xl text-lg font-semibold text-gray-700 hover:bg-blue-200 hover:text-blue-800 transition-colors duration-200 shadow-md border border-blue-100">
                <span className="text-2xl text-blue-600">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}