import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "카테고리가 필요합니다." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 4096,
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "너는 어린이 동화 작가야. 아이들이 몰입할 수 있도록 묘사와 대화를 풍부하게 넣고, 따뜻하고 감성적인 문체로 동화를 길게 써줘.",
        },
        {
          role: "user",
          content: `
아래 조건에 맞춰 동화를 작성해 주세요:

- 주제: ${category}
- 대상: 5~7세
- 제목 포함 (응답 맨 위에 '제목: [제목]')
- 분량: 최소 3000자 이상 (절대 짧게 요약하지 말 것)
- 구조: 도입 → 전개 → 갈등 → 해결 → 교훈
- 문체: 유아가 이해하기 쉬운 말투 + 풍부한 묘사
- 응답 형식:
제목: [제목]
내용: [동화 전체 내용]
          `,
        },
      ],
    });

    const fullText = completion.choices[0]?.message?.content?.trim();

    if (!fullText) {
      return res.status(500).json({ error: "동화 생성에 실패했습니다." });
    }

    const titleMatch = fullText.match(/제목:\s*(.*)/);
    const contentMatch = fullText.match(/내용:\s*([\s\S]*)/);

    const title = titleMatch ? titleMatch[1].trim() : "제목 없음";
    const story = contentMatch ? contentMatch[1].trim() : fullText;

    return res.status(200).json({ title, story });

  } catch (error) {
    console.error("❌ OpenAI 호출 실패:", error);
    return res.status(500).json({ error: "OpenAI API 호출 중 오류가 발생했습니다." });
  }
}
