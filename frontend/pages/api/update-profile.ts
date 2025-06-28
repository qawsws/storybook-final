// pages/api/update-profile.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userEmail = session.user?.email;
  if (req.method === "PUT") {
    const { name, birthdate, gender, phone } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { email: userEmail || undefined },
        data: { name, birthdate: new Date(birthdate), gender, phone },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Update failed", error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
