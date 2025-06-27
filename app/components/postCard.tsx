// components/PostList.tsx
'use client';
import { useEffect, useState } from 'react';
import { client } from '@/app/lib/client';
import { getPostsQuery } from '@/app/lib/queries';

type Post = {
  _id: string;
  content: string;
  authorName: string;
  authorImage: string;
  mediaUrl?: string;
  createdAt: string;
};

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await client.fetch(getPostsQuery);
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading posts...</p>;

  return (
    <div className="space-y-6 mt-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white p-4 rounded shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={post.authorImage || '/default-avatar.png'}
              alt={post.authorName}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-semibold">{post.authorName}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="mb-2">{post.content}</p>
          {post.mediaUrl && (
            <div className="mt-2">
              <video
                controls
                src={post.mediaUrl}
                className="w-full max-h-96 rounded"
              >
                Your browser does not support the video tag.
              </video>
              {/* If it's an image, use <img src={post.mediaUrl} /> instead */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostList;
