import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getSession({ req });
  if (!session || !['admin', 'teacher'].includes(session.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const course = await Course.create(req.body);
      return res.status(201).json(course);
    } catch (error) {
      return res.status(400).json({ message: 'Error creating course', error });
    }
  }

  if (req.method === 'GET') {
    try {
      const courses = await Course.find().populate('instructor');
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(400).json({ message: 'Error fetching courses', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
