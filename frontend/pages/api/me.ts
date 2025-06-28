// pages/api/me.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || undefined },
    select: {
      name: true,
      email: true,
      birthdate: true,
      gender: true,
      phone: true,
    },
  });

  res.status(200).json(user);
}
