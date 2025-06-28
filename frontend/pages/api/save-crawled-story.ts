import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../api/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { titleKo, contentKo } = req.body;

  // 유효성 검사
  if (!titleKo || !contentKo) {
    return res.status(400).json({ error: 'titleKo and contentKo are required' });
  }

  try {
    const story = await prisma.story.create({
      data: {
        title: titleKo,
        titleKo,
        content: contentKo,
        contentKo,
        userId: null,
        audioUrl: null,
      },
    });

    return res.status(200).json(story);
  } catch (error) {
    console.error('❌ Failed to save story:', error);
    return res.status(500).json({ error: 'Failed to save story' });
  }
}
