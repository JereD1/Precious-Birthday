'use client';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { client } from '@/app/lib/client'; // <-- make sure you have this set up


type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePostModal = ({ isOpen, onClose }: Props) => {
  const { user, isSignedIn } = useUser();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) {
      router.push('/sign-in');
      return;
    }

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
      } catch (err) {
        console.error('Media upload failed:', err);
        return;
      }
    }

    const post = {
  _type: 'post',
  content,
  media: uploadedMediaRef,
  authorId: user.id,
  authorName: user.firstName || '',
  authorImage: user?.imageUrl || '',
  createdAt: new Date().toISOString(),
};


    try {
      await client.create(post);
      setContent('');
      setMedia(null);
      onClose();
      router.refresh(); // optional: reload feed
    } catch (err) {
      console.error('Error, Try Again:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Create Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="border border-gray-300 p-2 w-full mb-4 rounded"
            required
          />
          <input
            type="file"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
            accept="image/*,video/*"
            className="mb-4"
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 text-gray-500">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
