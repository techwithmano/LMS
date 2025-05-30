import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Assignment from '@/models/Assignment';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getSession({ req });
  if (!session || !['admin', 'teacher'].includes(session.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const assignment = await Assignment.create(req.body);
      return res.status(201).json(assignment);
    } catch (error) {
      return res.status(400).json({ message: 'Error creating assignment', error });
    }
  }

  if (req.method === 'GET') {
    try {
      const assignments = await Assignment.find().populate('course');
      return res.status(200).json(assignments);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching assignments', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
