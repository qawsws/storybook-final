import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { content, id } = req.body;

  if (!content || !id) {
    return res.status(400).json({ message: "Missing content or id" });
  }

  //   ID인지 확인하는 간단한 로직 추가
  //   실제 Prisma ID는 cuid() 또는 uuid()로 생성된 긴 문자열입니다.
  //   ID (c1, c2 등)는 짧은 문자열이므로 이를 활용합니다.
  const isDummyId = id.length <= 5; // 예시: ID 길이가 5자 이하면 더미 ID로 간주 (필요에 따라 조건 조정)


  try {
    // 1. OpenAI TTS API 호출
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: content,
        voice: "nova",
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI TTS API Error:", response.status, errorData);
        return res.status(response.status).json({ message: `TTS generation failed: ${errorData.message || 'OpenAI API error'}` });
    }

    // 2. 음성 파일 저장
    const audioBuffer = await response.arrayBuffer();
    const publicAudioDir = path.join(process.cwd(), "public", "audio");
    
    if (!fs.existsSync(publicAudioDir)) {
      fs.mkdirSync(publicAudioDir, { recursive: true });
    }

    const outputPath = path.join(publicAudioDir, `${id}.mp3`);
    fs.writeFileSync(outputPath, Buffer.from(audioBuffer));

    const audioUrl = `/audio/${id}.mp3`;

    // 3. 데이터베이스에 audioUrl 업데이트 (더미 ID일 경우 건너김) ✅ 수정된 로직
    if (!isDummyId) { // 더미 ID가 아닐 때만 DB에 업데이트
      await prisma.story.update({
        where: { id: id },
        data: { audioUrl: audioUrl },
      });
    } else {
        console.log(`⚠️ 더미 ID(${id})이므로 DB 업데이트 건너뜀. 오디오 파일만 생성됨.`);
    }

    return res.status(200).json({ audioUrl: audioUrl });
  } catch (error) {
    console.error("TTS generation or DB update Error:", error);
    // 오류 메시지를 더 구체적으로 반환 (클라이언트에서 확인하기 좋도록)
    return res.status(500).json({ message: `TTS generation or DB update failed: ${error instanceof Error ? error.message : String(error)}` });
  } finally {
    await prisma.$disconnect();
  }
}