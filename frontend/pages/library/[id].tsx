import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/ui/Button";

interface CrawledStoryDetail {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImage: string;
}

export default function CrawledStoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession(); // ✅ 로그인 사용자 이름 추출
  const userName = session?.user?.name || null;

  const [story, setStory] = useState<CrawledStoryDetail | null>(null);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);

  useEffect(() => {
    if (typeof id === "string") {
      setTimeout(() => {
        if (id === 'c1') {
          setStory({
            id: 'c1',
            title: '아기 돼지 삼형제',
            author: '작자 미상',
            coverImage: '/images/story-thumbs/pig.jpg',
            content: `옛날 옛날 아주 먼 옛날, 아기 돼지 삼형제가 살았어요...`,
          });
        } else if (id === 'c2') {
          setStory({
            id: 'c2',
            title: '빨간 모자',
            author: '그림 형제',
            coverImage: '/images/story-thumbs/red-hood.jpg',
            content: `옛날 옛날에 빨간 모자를 쓴 예쁜 소녀가 살았어요...`,
          });
        } else {
          setError("해당 동화를 찾을 수 없습니다.");
        }
      }, 500);
    }
  }, [id]);

  const handleGenerateVoice = async () => {
    if (!story?.content) {
      alert("동화 내용이 없습니다.");
      return;
    }

    setLoadingAudio(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: story.content }),
      });

      const data = await res.json();
      if (res.ok && data.audioUrl) {
        setAudioUrl(data.audioUrl);
      } else {
        alert("오디오 생성에 실패했습니다: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("음성 생성 중 에러:", err);
      alert("에러 발생: 음성을 생성할 수 없습니다.");
    } finally {
      setLoadingAudio(false);
    }
  };

  if (error) {
    return (
      <MainLayout userName={userName} showSidebar={false}>
        <p className="text-red-500 text-center mt-10 text-xl">{error}</p>
      </MainLayout>
    );
  }

  if (!story) {
    return (
      <MainLayout userName={userName} showSidebar={false}>
        <p className="text-center mt-10 text-pink-600 font-semibold animate-bounce text-xl">
          동화를 불러오는 중입니다...
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout userName={userName} showSidebar={false}>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 p-10 font-gowun text-gray-800">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-pink-200">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">{story.title}</h1>
          <p className="text-md text-center text-gray-600 mb-6">작가: {story.author}</p>

          {story.coverImage && (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden shadow-md">
              <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="whitespace-pre-line leading-loose text-lg text-gray-700 mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-inner">
            {story.content}
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleGenerateVoice}
              disabled={loadingAudio}
              primary
              className="px-8 py-3 text-lg"
            >
              {loadingAudio ? "음성 생성 중..." : "🔊 AI 음성으로 듣기"}
            </Button>

            {audioUrl && (
              <audio
                src={audioUrl}
                controls
                autoPlay
                className="mt-6 mx-auto w-full max-w-md"
              />
            )}
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => router.back()} secondary>
              목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
