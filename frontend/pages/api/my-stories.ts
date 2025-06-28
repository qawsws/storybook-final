import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || undefined },
    select: { id: true }
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = (page - 1) * limit;

  const [stories, totalCount] = await Promise.all([
    prisma.story.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.story.count({
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({ stories, totalPages });
}
