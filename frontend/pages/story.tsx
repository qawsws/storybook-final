// frontend/pages/story.tsx (AI 창작 동화관) (최종 버전, savedStoryId 필드 수정 반영)
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Button from "../components/ui/Button";
import Image from "next/image";

const categories = [
  { name: "동물", icon: "/images/category-icons/animal.png" },
  { name: "모험", icon: "/images/category-icons/adventure.png" },
  { name: "우정", icon: "/images/category-icons/friendship.png" },
  { name: "교훈", icon: "/images/category-icons/lesson.png" },
  { name: "가족", icon: "/images/category-icons/family.png" },
  { name: "판타지", icon: "/images/category-icons/fantasy.png" },
  { name: "용기", icon: "/images/category-icons/courage.png" },
  { name: "환경", icon: "/images/category-icons/environment.png" },
  { name: "과학", icon: "/images/category-icons/science.png" },
  { name: "마법", icon: "/images/category-icons/magic.png" },
  { name: "사랑", icon: "/images/category-icons/love.png" },
  { name: "시간 여행", icon: "/images/category-icons/time-travel.png" },
];

export default function StoryCreationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [storySaved, setStorySaved] = useState(false);

  const generateAndSaveStory = async (categoryToGenerate: string) => {
    if (!session) {
      alert("로그인이 필요합니다. 동화 생성 및 저장을 위해 로그인해주세요.");
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");
    setStory("");
    setTitle("");
    setAudioUrl(null);
    setStorySaved(false);

    try {
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: categoryToGenerate }),
      });
      const generateData = await generateRes.json();

      if (generateData.error) {
        setError(generateData.error);
        setLoading(false);
        return;
      }

      const generatedTitle = generateData.title || "제목 없음";
      const generatedStory = generateData.story || "동화 생성 실패";
      setTitle(generatedTitle);
      setStory(generatedStory);

      // 2. 생성된 동화 자동 저장 API 호출
      const saveRes = await fetch("/api/save-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedTitle,
          category: categoryToGenerate,
          content: generatedStory,
        }),
      });

      let savedStoryId = null;
      if (!saveRes.ok) {
        const saveData = await saveRes.json();
        alert("동화 자동 저장 실패: " + (saveData.error || "알 수 없는 오류"));
      } else {
        const savedData = await saveRes.json();
        setStorySaved(true);
        savedStoryId = savedData.id; // ✅ savedData.user.id -> savedData.id로 수정
      }

      // 3. 음성 생성 API 호출 및 자동 재생
      const voiceRes = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedStory,
          id: savedStoryId, // 저장된 동화의 ID를 전달
        }),
      });
      const voiceData = await voiceRes.json();

      if (voiceData.audioUrl) {
        setAudioUrl(voiceData.audioUrl);
      } else {
        console.error("음성 생성 실패:", voiceData.error);
      }

    } catch (err) {
      console.error("동화 생성 또는 저장 중 에러:", err);
      setError("동화 생성/저장 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    generateAndSaveStory(categoryName);
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8 drop-shadow-md">
        ✨ AI 창작 동화관
      </h1>

      {!selectedCategory ? (
        <div className="w-full max-w-3x1 mx-auto p-6 bg-gradient-to-br from-yellow-100 via-lime-100 to-sky-100 rounded-xl shadow-lg m-8
                        aspect-square flex flex-col justify-center items-center">
          <p className="text-xl text-center text-gray-700 mb-8">
            원하는 동화 카테고리를 선택하고, AI가 만들어주는 마법 같은 이야기를 경험해보세요!
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 border-4 border-transparent hover:border-blue-400 w-32 h-32 text-lg font-semibold text-gray-700 transform rotate-3 hover:rotate-0"
              >
                <Image src={cat.icon} alt={cat.name} width={50} height={50} className="mb-2" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            선택된 카테고리: <span className="text-black">{selectedCategory}</span>
          </h2>

          {loading ? (
            <div className="text-lg text-pink-500 font-semibold animate-bounce text-center">
              🧚‍♀️ 마법을 부리는 중입니다...
            </div>
          ) : error ? (
            <div className="text-red-500 mt-4 font-medium text-center">{error}</div>
          ) : story && (
            <div className="flex flex-col items-center">
              <h3 className="text-3xl font-bold text-center text-orange-600 mb-4">{title}</h3>
              <textarea
                className="w-full max-w-3xl mb-6 p-4 border rounded-lg resize-none h-[500px] leading-loose text-lg shadow-inner bg-yellow-50 whitespace-pre-line overflow-y-auto cursor-not-allowed border-2 border-yellow-200"
                value={story}
                readOnly
              />
              {audioUrl && (
                <audio
                  src={audioUrl}
                  controls
                  className="mt-4 mx-auto w-full max-w-md"
                />
              )}
              {storySaved && (
                  <p className="text-green-600 font-semibold mt-4">✅ 동화가 자동으로 저장되었습니다!</p>
              )}
              <div className="mt-6 flex justify-center gap-4">
                <Button onClick={() => setSelectedCategory("")} primary>다른 동화 만들기</Button>
                <Button onClick={() => router.push("/mypage")} secondary>
                  내 동화 목록으로
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}