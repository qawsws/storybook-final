// pages/api/story/get-crawled.ts

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stories = await prisma.story.findMany({
      where: {
        userId: null, // 유저가 작성한 것이 아닌 크롤링된 동화만
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(stories);
  } catch (error) {
    console.error("❌ get-crawled.ts 오류:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
}
