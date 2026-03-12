'use client';

import { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { client } from '@/app/lib/client';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CreatePostModal = ({ isOpen, onClose }: Props) => {
  const { user, isSignedIn } = useUser();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setMedia(file);
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null); // video — no preview thumbnail
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const removeMedia = () => {
    setMedia(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user) { router.push('/login'); return; }

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
          asset: { _type: 'reference', _ref: asset._id },
        };
      } catch (error) {
        console.error('Media upload failed:', error);
        setLoading(false);
        return;
      }
    }

    try {
      await client.create({
        _type: 'post',
        content,
        media: uploadedMediaRef,
        authorId: user.id,
        authorName: user.firstName || user.username || '',
        authorImage: user.imageUrl || '',
        createdAt: new Date().toISOString(),
      });
      setContent('');
      setMedia(null);
      setPreview(null);
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const charLimit = 500;
  const charLeft = charLimit - content.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white">Create Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {loading ? (
          /* Loading state */
          <div className="p-5 space-y-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="w-28 h-3 bg-gray-800 rounded-full" />
                <div className="w-full h-20 bg-gray-800 rounded-xl" />
              </div>
            </div>
            <div className="h-10 bg-gray-800 rounded-xl" />
            <div className="flex justify-end">
              <div className="w-24 h-10 bg-gray-800 rounded-full" />
            </div>
            <p className="text-center text-xs text-gray-600">Posting your birthday wish... 🎂</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-5">
              {/* Author + Textarea */}
              <div className="flex gap-3">
                <img
                  src={user?.imageUrl || '/default-avatar.png'}
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-700"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white mb-2">
                    {user?.fullName || user?.username || 'You'}
                  </p>
                  <textarea
                    value={content}
                    onChange={(e) => {
                      if (e.target.value.length <= charLimit) setContent(e.target.value);
                    }}
                    placeholder="Share a birthday wish, memory, or celebration... 🎉"
                    rows={4}
                    className="w-full bg-transparent text-gray-200 placeholder-gray-600 text-sm leading-relaxed resize-none focus:outline-none"
                    required
                  />

                  {/* Char counter */}
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${charLeft < 50 ? 'text-pink-500' : 'text-gray-700'}`}>
                      {charLeft}
                    </span>
                  </div>
                </div>
              </div>

              {/* Media preview */}
              {preview && (
                <div className="mt-3 ml-13 relative rounded-2xl overflow-hidden border border-gray-800 group">
                  <img src={preview} alt="Preview" className="w-full max-h-56 object-cover" />
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white text-xs transition opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Video selected (no preview) */}
              {media && !preview && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-gray-900 rounded-2xl border border-gray-800">
                  <span className="text-2xl">🎬</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 font-medium truncate">{media.name}</p>
                    <p className="text-xs text-gray-600">{(media.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="text-gray-600 hover:text-white transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Drag & Drop zone (shown when no media) */}
              {!media && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-4 border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-gray-800 hover:border-gray-600 hover:bg-gray-900/50'
                  }`}
                >
                  <p className="text-2xl mb-1">📎</p>
                  <p className="text-sm text-gray-400 font-medium">
                    Drag & drop or <span className="text-pink-400 hover:underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Supports images (JPG, PNG, GIF, WEBP) and videos (MP4, MOV, WEBM)
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800" />

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4">
              {/* Media attach shortcut */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:text-pink-400 hover:bg-pink-500/10 transition text-sm"
                  title="Add photo or video"
                >
                  <span>🖼️</span>
                  <span className="text-xs hidden sm:block">Photo / Video</span>
                </button>
              </div>

              {/* Post button */}
              <button
                type="submit"
                disabled={!content.trim() || loading}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-bold rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-900/30 hover:scale-105 active:scale-95"
              >
                Post 🎉
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;