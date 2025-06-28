import React, { useState } from 'react';
import Button from '../ui/Button';

interface VoiceReaderProps {
  storyId: string;
  onPlayRequested?: () => void; // 선택적 콜백
}

export default function VoiceReader({ storyId, onPlayRequested }: VoiceReaderProps) {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateVoice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId }),
      });

      const data = await res.json();
      if (res.ok && data.audioUrl) {
        setAudioUrl(data.audioUrl);
        onPlayRequested?.();
      } else {
        alert('음성 생성 실패: ' + (data.error || '알 수 없는 오류'));
      }
    } catch (err) {
      console.error('TTS 에러:', err);
      alert('음성 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <Button
        onClick={generateVoice}
        disabled={loading}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? '생성 중...' : '📖 AI 동화 읽기'}
      </Button>

      {audioUrl && (
        <audio controls className="w-full mt-2">
          <source src={audioUrl} type="audio/mpeg" />
          브라우저가 audio 태그를 지원하지 않습니다.
        </audio>
      )}
    </div>
  );
}
