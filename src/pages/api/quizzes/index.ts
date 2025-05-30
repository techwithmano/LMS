import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getSession({ req });
  if (!session || !['admin', 'teacher'].includes(session.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const quiz = await Quiz.create(req.body);
      return res.status(201).json(quiz);
    } catch (error) {
      return res.status(400).json({ message: 'Error creating quiz', error });
    }
  }

  if (req.method === 'GET') {
    try {
      const quizzes = await Quiz.find().populate('course');
      return res.status(200).json(quizzes);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching quizzes', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
