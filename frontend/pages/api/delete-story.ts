// frontend/pages/api/delete-story.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // NextAuth 인증 옵션 임포트
import fs from "fs"; // 파일 시스템 모듈 임포트
import path from "path"; // 경로 모듈 임포트

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" }); // 로그인된 사용자만 접근 가능
  }

  const { id } = req.body; // 삭제할 동화의 ID

  if (!id) {
    return res.status(400).json({ error: "Missing story ID" });
  }

  try {
    // 1. 동화 존재 여부 및 소유권 확인
    const storyToDelete = await prisma.story.findUnique({
      where: { id: id },
      select: { // 필요한 필드만 선택적으로 가져옴
        userId: true,
        audioUrl: true, // 음성 파일 경로를 가져오기 위함
      }
    });

    if (!storyToDelete) {
      return res.status(404).json({ error: "Story not found" });
    }

    // 현재 로그인된 사용자가 동화의 소유자인지 확인 (중요한 보안 로직)
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser || storyToDelete.userId !== currentUser.id) {
      return res.status(403).json({ error: "Forbidden: You do not own this story." });
    }

    // 2. 연결된 음성 파일 삭제 (public/audio에서)
    if (storyToDelete.audioUrl) {
      const audioFilePath = path.join(process.cwd(), "public", storyToDelete.audioUrl);
      try {
        if (fs.existsSync(audioFilePath)) {
          fs.unlinkSync(audioFilePath); // 파일 시스템에서 파일 삭제
          console.log(`✅ 오디오 파일 삭제 성공: ${audioFilePath}`);
        } else {
          console.warn(`⚠️ 오디오 파일이 존재하지 않아 건너뜀: ${audioFilePath}`);
        }
      } catch (fileError) {
        console.error("❌ 오디오 파일 삭제 실패:", fileError);
        // 파일 삭제 실패해도 DB 삭제는 진행 (치명적 오류는 아님)
      }
    }

    // 3. 데이터베이스에서 동화 레코드 삭제
    await prisma.story.delete({
      where: { id: id },
    });

    return res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("❌ 동화 삭제 서버 오류:", error);
    return res.status(500).json({ error: "Failed to delete story" });
  } finally {
    await prisma.$disconnect(); // 요청 처리 후 Prisma 클라이언트 연결 해제
  }
}