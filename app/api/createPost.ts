import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: "e9q159no",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // must be set in .env.local
});

// Define the expected structure for the post
interface PostData {
  content: string;
  media?: File | null;
  authorId: string;
  authorName: string;
  authorImage?: string;
}

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, media, authorId, authorName, authorImage }: PostData = req.body;

    const post = {
      _type: 'post',
      content,
      media, // Adjust if you need to handle media differently
      authorId,
      authorName,
      authorImage,
      createdAt: new Date().toISOString(),
    };

    try {
      await client.create(post);
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}







