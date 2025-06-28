// frontend/pages/api/story/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "잘못된 요청입니다." });
  }

  // ✅ 임시 더미 데이터 (프론트엔드의 library/index.tsx 더미 데이터와 매칭)
  const dummyStories = [
    { id: 'c1', title: '아기 돼지 삼형제', author: '작자 미상', category: '교훈', content: '옛날 옛날 아주 먼 옛날, 아기 돼지 삼형제가 살았어요. 첫째 돼지는 지푸라기 집을 짓고, 둘째 돼지는 나무 집을 지었지만, 셋째 돼지는 튼튼한 벽돌 집을 지었어요. 사악한 늑대가 나타나 첫째와 둘째의 집을 날려버렸지만, 셋째의 벽돌 집은 끄떡 없었죠. 늑대는 굴뚝으로 들어오려 했지만, 셋째 돼지는 냄비에 물을 끓여 늑대를 물리쳤답니다. 이 이야기는 노력과 지혜의 중요성을 가르쳐 줍니다.', audioUrl: null, createdAt: new Date().toISOString() },
    { id: 'c2', title: '빨간 모자', author: '그림 형제', category: '모험', content: '빨간 모자를 쓴 소녀가 할머니 댁에 가기 위해 숲을 지나가고 있었어요. 숲에서 만난 늑대는 빨간 모자를 속여 꽃을 따게 하고, 먼저 할머니 집에 도착해서 할머니를 잡아먹었어요. 그리고 할머니로 변장하여 빨간 모자까지 잡아먹으려 했죠. 다행히 사냥꾼이 나타나 늑대를 물리치고 할머니와 빨간 모자를 구해주었답니다. 낯선 사람의 말을 조심해야 한다는 교훈을 줍니다.', audioUrl: null, createdAt: new Date().toISOString() },
    { id: 'c3', title: '흥부와 놀부', author: '작자 미상', category: '교훈', content: '옛날 옛날에 흥부와 놀부라는 형제가 살았어요. 착한 흥부는 제비 다리를 고쳐주었고, 제비는 흥부에게 박씨를 물어다 주었어요. 박에서는 온갖 보물이 쏟아져 나왔죠. 이를 본 욕심 많은 놀부는 일부러 제비 다리를 부러뜨렸지만, 놀부에게는 도깨비와 벌만 쏟아져 나왔답니다. 착하게 살아야 한다는 교훈을 줍니다.', audioUrl: null, createdAt: new Date().toISOString() },
    { id: 'c4', title: '백설공주', author: '그림 형제', category: '환상', content: '세상에서 가장 아름다운 백설공주는 새 왕비의 질투를 샀어요. 새 왕비는 마법 거울에게 누가 가장 예쁜지 물었고, 거울은 항상 백설공주라고 대답했죠. 결국 백설공주는 숲으로 도망쳐 일곱 난쟁이들과 살게 되었어요. 왕비는 독사과로 백설공주를 잠재웠지만, 왕자님의 키스로 백설공주는 다시 깨어났답니다.', audioUrl: null, createdAt: new Date().toISOString() },
    { id: 'c5', title: '피노키오', author: '카를로 콜로디', category: '모험', content: '제페토 할아버지가 만든 나무 인형 피노키오는 거짓말을 하면 코가 길어지는 특징을 가지고 있었어요. 피노키오는 사람이 되기 위해 많은 모험을 겪고, 정직함과 용기를 배우게 된답니다.', audioUrl: null, createdAt: new Date().toISOString() },
    { id: 'c6', title: '신데렐라', author: '샤를 페로', category: '환상', content: '신데렐라는 새엄마와 언니들의 구박을 받으며 힘들게 살았어요. 하지만 요정 할머니의 도움으로 무도회에 갈 수 있게 되었고, 그곳에서 왕자님을 만났죠. 밤 12시가 되자 마법이 풀려 도망치다 유리 구두 한 짝을 잃어버렸지만, 왕자님은 유리 구두의 주인을 찾아 결국 신데렐라와 결혼했답니다.', audioUrl: null, createdAt: new Date().toISOString() },
  ];

  // 먼저 더미 데이터에서 찾기
  const dummyStory = dummyStories.find(s => s.id === id);
  if (dummyStory) {
    return res.status(200).json(dummyStory);
  }

  // 더미 데이터에 없으면 실제 DB에서 찾기 (기존 로직)
  try {
    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      return res.status(404).json({ error: "동화를 찾을 수 없습니다." });
    }

    res.status(200).json(story);
  } catch (error) {
    console.error("❌ 서버 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
}