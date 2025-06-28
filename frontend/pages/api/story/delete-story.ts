// ✅ /pages/api/delete-story.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "DELETE 메서드만 허용됩니다." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "로그인이 필요합니다." });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "삭제할 동화 ID가 없습니다." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const deleted = await prisma.story.deleteMany({
      where: {
        id,
        OR: [
          { userId: user?.id },
          { userId: null }, // AI 동화처럼 user 없이 저장된 항목도 삭제 허용
        ],
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "삭제할 동화를 찾을 수 없습니다." });
    }

    return res.status(200).json({ message: "삭제 성공" });
  } catch (error) {
    console.error("삭제 실패:", error);
    return res.status(500).json({ error: "서버 오류로 삭제 실패" });
  }
}
