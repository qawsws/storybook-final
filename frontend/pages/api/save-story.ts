// ✅ 동화 저장 API
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) return res.status(401).json({ error: "Unauthorized" });

  const { title, category, content } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const newStory = await prisma.story.create({
      data: {
        title,
        category,
        content,
        userId: user.id,
      },
    });

    res.status(200).json(newStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 오류" });
  }
}
