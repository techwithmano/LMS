import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });
  let uploadPromise: Promise<any> | null = null;

  bb.on('file', (_name: string, file: any, info: any) => {
    uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      file.pipe(stream);
    });
  });

  bb.on('finish', async () => {
    try {
      const result = await uploadPromise;
      res.status(200).json({ url: result.secure_url });
    } catch (e) {
      res.status(500).json({ error: 'Upload failed', details: e });
    }
  });

  req.pipe(bb);
}
