// frontend/components/specific/StoryList.tsx
import Link from 'next/link';
import Image from 'next/image';

interface StoryItem {
  id: string;
  title: string;
  author?: string;
  category?: string;
  coverImage?: string;
  description?: string;
  createdAt?: string; // AI 동화용
}

interface StoryListProps {
  stories: StoryItem[];
  baseUrl: string; // /library 또는 /story (AI 동화 상세)
}

export default function StoryList({ stories, baseUrl }: StoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stories.map((story) => (
        <Link href={`${baseUrl}/${story.id}`} key={story.id}>
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer border border-purple-200">
            {story.coverImage && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-t-xl"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-purple-700 mb-2 truncate">
                {story.title}
              </h3>
              {story.author && <p className="text-gray-600 text-sm mb-1">작가: {story.author}</p>}
              {story.category && <p className="text-gray-600 text-sm mb-1">카테고리: {story.category}</p>}
              {story.description && <p className="text-gray-500 text-sm line-clamp-2">{story.description}</p>}
              {story.createdAt && <p className="text-gray-400 text-xs mt-2">생성일: {new Date(story.createdAt).toLocaleDateString()}</p>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}