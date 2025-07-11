'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { client } from '@/app/lib/client'; // Your Sanity client instance

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePostModal = ({ isOpen, onClose }: Props) => {
  const { user, isSignedIn } = useUser();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    let uploadedMediaRef = null;

    if (media) {
      try {
        const asset = await client.assets.upload('file', media, {
          contentType: media.type,
          filename: media.name,
        });

        uploadedMediaRef = {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        };
      } catch (error) {
        console.error('Media upload failed:', error);
        setLoading(false);
        return;
      }
    }

    const postDoc = {
      _type: 'post',
      content,
      media: uploadedMediaRef,
      authorId: user.id,
      authorName: user.firstName || '',
      authorImage: user.imageUrl || '',
      createdAt: new Date().toISOString(),
    };

    try {
      await client.create(postDoc);
      setContent('');
      setMedia(null);
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded shadow-lg w-full max-w-md relative">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-1/3 rounded bg-gray-300"></div>
            <div className="h-24 rounded bg-gray-300"></div>
            <div className="h-10 rounded bg-gray-300"></div>
            <div className="flex justify-end space-x-2">
              <div className="h-10 w-20 rounded bg-gray-300"></div>
              <div className="h-10 w-20 rounded bg-gray-300"></div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4">Create Post</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="border border-gray-300 p-2 w-full mb-4 rounded resize-none"
                required
                disabled={loading}
              />
              <input
                type="file"
                onChange={(e) => setMedia(e.target.files?.[0] || null)}
                accept="image/*,video/*"
                className="mb-4"
                disabled={loading}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 text-gray-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
                  disabled={loading}
                >
                  Post
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
