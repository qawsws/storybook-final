// frontend/pages/story/[id].tsx (최종 버전, 브라우저 음성 기능 제거 반영)
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react"; // 필요없다면 제거
import Button from "../../components/ui/Button";

interface StoryDetail {
  id: string;
  title: string;
  category: string;
  author?: string;
  content: string;
  audioUrl?: string | null;
  createdAt: string;
}

export default function StoryDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  // const { data: session, status } = useSession(); // 세션 정보가 필요없다면 제거

  const [story, setStory] = useState<StoryDetail | null>(null);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [loadingStory, setLoadingStory] = useState(true);
  // const [synth, setSynth] = useState<SpeechSynthesis | null>(null); // ✅ 제거: 브라우저 음성 기능을 사용하지 않음

  useEffect(() => {
    if (typeof id === "string") {
      setLoadingStory(true);
      setError('');
      fetch(`/api/story/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            setStory(null);
          } else {
            setStory(data);
            if (data.audioUrl) {
                setAudioUrl(data.audioUrl);
            }
          }
          setLoadingStory(false);
        })
        .catch(err => {
          console.error("동화 상세 정보 로드 실패:", err);
          setError("동화 정보를 불러오는데 실패했습니다.");
          setStory(null);
          setLoadingStory(false);
        });
    } else if (!id) {
        setLoadingStory(false);
        setError("유효한 동화 ID가 없습니다.");
    }
  }, [id]);

  // ✅ 제거: 브라우저 음성 합성 API 초기화 useEffect
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  //     setSynth(window.speechSynthesis);
  //   }
  // }, []);

  // AI 음성 생성 (기존 로직 유지)
  const handleGenerateVoice = async () => {
    if (!story?.content) {
      alert("동화 내용이 없습니다.");
      return;
    }
    setLoadingAudio(true);

    try {
      const res = await fetch("/api/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: story.content,
          id: story.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.audioUrl) {
        setAudioUrl(data.audioUrl);
        alert("AI 음성 생성 및 저장 성공!"); // 사용자에게 알림
      } else {
        alert("AI 음성 생성에 실패했습니다: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("음성 생성 중 에러:", err);
      alert("에러 발생: AI 음성을 생성할 수 없습니다.");
    } finally {
      setLoadingAudio(false);
    }
  };

  // ✅ 제거: 브라우저 음성으로 읽기 기능 추가 함수
  // const handleBrowserSpeak = () => { /* ... */ };

  // ✅ 제거: 브라우저 음성 읽기 중지 기능 추가 함수
  // const handleStopSpeaking = () => { /* ... */ };


  if (loadingStory) {
    return <p className="text-center mt-10 text-xl">동화를 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10 text-xl">{error}</p>;
  }

  if (!story) {
    return <p className="text-center mt-10 text-red-500 text-xl">해당 동화를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8 drop-shadow-md">
        {story.title}
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border-2 border-purple-300">
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">카테고리:</span> {story.category} |{' '}
          <span className="font-semibold">작성일:</span> {new Date(story.createdAt).toLocaleDateString("ko-KR")}
        </p>
        {story.author && (
          <p className="text-lg text-gray-700 mb-4">
            <span className="font-semibold">작가:</span> {story.author}
          </p>
        )}
        <hr className="my-6 border-gray-200" />
        <div className="whitespace-pre-line leading-loose text-lg text-gray-700 mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-inner">
          {story.content}
        </div>

        <div className="mt-8 text-center flex justify-center gap-4"> {/* 버튼들을 중앙 정렬하고 간격을 줍니다. */}
          {/* AI 음성 생성 버튼 (기존 유지) */}
          {!audioUrl ? (
              <Button
                  onClick={handleGenerateVoice}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
                  disabled={loadingAudio}
              >
                  {loadingAudio ? "AI 음성 생성 중..." : "🔊 AI 음성으로 듣기"}
              </Button>
          ) : (
              // AI 음성 파일이 있을 때 재생 컨트롤러 표시
              <div className="flex flex-col items-center gap-2">
                <p className="text-green-600 font-semibold">✅ AI 음성 준비 완료!</p>
                <audio
                  src={audioUrl}
                  controls
                  className="mt-2 mx-auto w-full max-w-md"
                />
              </div>
          )}

          {/* ✅ 제거: 브라우저 음성으로 듣기 버튼 */}
          {/* {synth && (
            <Button
              onClick={synth.speaking ? handleStopSpeaking : handleBrowserSpeak}
              className={`px-6 py-3 rounded-xl transition ${synth.speaking ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
            >
              {synth.speaking ? "⏹ 브라우저 음성 중지" : "🗣️ 브라우저 음성으로 듣기"}
            </Button>
          )} */}

        </div>
        <div className="text-center mt-8">
          <Button onClick={() => router.back()} secondary>목록으로 돌아가기</Button>
        </div>
      </div>
    </div>
  );
}