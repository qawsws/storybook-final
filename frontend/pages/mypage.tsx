import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Pagination from "../components/ui/Pagination";
import VoiceReader from "../components/specific/VoiceReader"; // ✅ TTS 컴포넌트
import Link from "next/link";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (session) {
      fetch("/api/me")
        .then((res) => res.json())
        .then((data) => setUserInfo(data));

      fetch(`/api/my-stories?page=${page}&limit=${itemsPerPage}`)
        .then((res) => res.json())
        .then((data) => {
          setStories(data.stories);
          setTotalPages(data.totalPages);
        });
    }
  }, [session, page]);

  const handleUpdate = async () => {
    const res = await fetch("/api/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    });
    if (res.ok) {
      alert("정보가 수정되었습니다.");
      setEditing(false);
    } else {
      alert("정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteStory = async (id: string) => {
    const confirmed = confirm("정말 이 동화를 삭제하시겠습니까?");
    if (!confirmed) return;
    const res = await fetch("/api/delete-story", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      alert("동화가 삭제되었습니다.");
      setStories(stories.filter((s) => s.id !== id));
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  if (status === "loading") return <p className="text-center mt-10 text-xl">로딩 중...</p>;
  if (!session) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8 drop-shadow-md">
        👤 내 정보 & 📚 동화 관리
      </h1>

      {/* 사용자 정보 섹션 */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-12 border border-purple-200">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 border-b pb-3">내 정보</h2>
        {userInfo && (
          <div>
            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">이름:</label>
                  <Input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="text-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">생년월일:</label>
                  <Input
                    type="date"
                    value={userInfo.birthdate.slice(0, 10)}
                    onChange={(e) => setUserInfo({ ...userInfo, birthdate: e.target.value })}
                    className="text-lg"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">성별:</label>
                  <Select
                    value={userInfo.gender}
                    onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
                    className="text-lg"
                  >
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                    <option value="비공개">비공개</option>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-1">전화번호:</label>
                  <Input
                    type="text"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    className="text-lg"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                  <Button onClick={handleUpdate} primary>저장</Button>
                  <Button onClick={() => setEditing(false)} secondary>취소</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[auto_1fr] border border-gray-300 rounded-md overflow-hidden text-lg">
                <span className="font-semibold text-gray-700 p-2 border-b border-r border-gray-200 bg-gray-50">이메일:</span>
                <span className="text-gray-800 p-2 border-b border-gray-200">{userInfo.email}</span>

                <span className="font-semibold text-gray-700 p-2 border-b border-r border-gray-200 bg-gray-50">이름:</span>
                <span className="text-gray-800 p-2 border-b border-gray-200">{userInfo.name}</span>

                <span className="font-semibold text-gray-700 p-2 border-b border-r border-gray-200 bg-gray-50">생년월일:</span>
                <span className="text-gray-800 p-2 border-b border-gray-200">{new Date(userInfo.birthdate).toLocaleDateString("ko-KR")}</span>

                <span className="font-semibold text-gray-700 p-2 border-b border-r border-gray-200 bg-gray-50">성별:</span>
                <span className="text-gray-800 p-2 border-b border-gray-200">{userInfo.gender}</span>

                <span className="font-semibold text-gray-700 p-2 border-r border-gray-200 bg-gray-50">전화번호:</span>
                <span className="text-gray-800 p-2">{userInfo.phone}</span>

                <div className="col-span-full flex justify-end mt-6 p-2">
                  <Button onClick={() => setEditing(true)} primary>정보 수정</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 내가 만든 동화 목록 섹션 */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-blue-200">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b pb-3">내가 만든 동화 목록</h2>
        {stories.length > 0 ? (
          <>
            <ul className="space-y-6">
              {stories.map((story) => (
                <li
                  key={story.id}
                  className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-100 flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="flex-grow">
                    <Link href={`/story/${story.id}`} className="text-xl font-semibold text-blue-800 hover:underline">
                      [{story.category}] {story.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      생성일: {new Date(story.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                    {story.audioUrl && (
                      <audio controls src={story.audioUrl} className="mt-3 w-full"></audio>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                    <VoiceReader storyId={story.id} />
                    <Button
                      onClick={() => handleDeleteStory(story.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      동화 삭제
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <p className="text-center text-gray-600 text-xl p-8">아직 생성한 동화가 없습니다. AI 창작 동화관에서 첫 동화를 만들어보세요! ✨</p>
        )}
      </div>
    </div>
  );
}
