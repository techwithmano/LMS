import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const comment = await Comment.create({ ...req.body, author: session.user.id });
      return res.status(201).json(comment);
    } catch (error) {
      return res.status(400).json({ message: 'Error creating comment', error });
    }
  }

  if (req.method === 'GET') {
    try {
      const comments = await Comment.find().populate('author').populate('course').populate('lesson').populate('parent');
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching comments', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
