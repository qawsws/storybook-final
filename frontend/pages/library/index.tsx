import React, { useState, useEffect } from "react";
import StoryList from "../../components/specific/StoryList";

interface Story {
  id: string;
  title: string;
  author?: string;
  category: string;
  content: string;
  audioUrl?: string | null;
  createdAt: string;
  coverImage?: string; // DB에는 없어도 StoryList 컴포넌트가 쓸 수 있게 옵션
}

export default function CrawledLibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("/api/story/get-crawled")
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 실패");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setStories(data);
        } else {
          throw new Error("잘못된 데이터 형식");
        }
      })
      .catch((err) => {
        console.error("❌ API 호출 실패:", err);
        setError("동화 불러오기에 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-screen-lg mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8 drop-shadow-md">
        📚 시중 동화관
      </h1>

      {loading ? (
        <p className="text-center text-xl text-purple-600 animate-pulse">
          동화 목록을 불러오는 중...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 text-xl">{error}</p>
      ) : stories.length > 0 ? (
        <StoryList stories={stories} baseUrl="/story" />
      ) : (
        <p className="text-center text-gray-600 text-xl">
          현재 시중 동화가 없습니다.
        </p>
      )}
    </div>
  );
}
