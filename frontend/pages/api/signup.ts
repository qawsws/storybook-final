import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POST 요청만 허용됩니다." });
  }

  const { email, password, name, birthdate, gender, phone } = req.body;

  if (!email || !password || !name || !birthdate || !gender || !phone) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  const parsedBirthdate = new Date(birthdate);
  if (isNaN(parsedBirthdate.getTime())) {
    return res.status(400).json({ message: "유효한 생년월일을 입력해주세요." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        birthdate: parsedBirthdate,
        gender,
        phone,
      },
    });

    return res.status(201).json({ message: "회원가입 성공", user: newUser });
  } catch (err) {
    console.error("회원가입 오류:", err);
    return res.status(500).json({ message: "서버 오류 발생" });
  }
}
