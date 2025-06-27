'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { client } from '@/app/lib/client';
import { getPostsQuery } from '@/app/lib/queries';

type Comment = {
  commenterId: string;
  commenterName: string;
  commenterImage?: string;
  text: string;
  createdAt: string;
};

type Post = {
  _id: string;
  content: string;
  authorName: string;
  authorImage: string;
  mediaUrl?: string;
  createdAt: string;
  likes?: number;
  comments?: Comment[];
};

const PostList = () => {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({});
  const [modalImage, setModalImage] = useState<string | null>(null);

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

  const likePost = async (postId: string) => {
    if (!isSignedIn) return alert('You need to sign in to like a post.');

    try {
      await client.patch(postId).inc({ likes: 1 }).commit();
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: (post.likes ?? 0) + 1 } : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const addComment = async (postId: string) => {
    const text = commentTexts[postId]?.trim();
    if (!isSignedIn || !text) return;

    const comment: Comment = {
      commenterId: user.id,
      commenterName: user.fullName || user.username || 'Anonymous',
      commenterImage: user.imageUrl,
      text,
      createdAt: new Date().toISOString(),
    };

    try {
      await client
        .patch(postId)
        .setIfMissing({ comments: [] })
        .append('comments', [comment])
        .commit();

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments ? [...post.comments, comment] : [comment],
              }
            : post
        )
      );

      setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading posts...</p>;

  return (
    <>
      <div className="space-y-8 mt-8 max-w-3xl mx-auto">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={post.authorImage || '/default-avatar.png'}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <p className="font-semibold text-lg text-gray-900">{post.authorName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="text-gray-800 text-base mb-4 whitespace-pre-line">{post.content}</p>

            {/* Media */}
            {post.mediaUrl && (
              <div className="rounded-lg overflow-hidden mb-6 shadow-sm cursor-pointer">
                {post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.webm') ? (
                  <video
                    controls
                    src={post.mediaUrl}
                    className="w-full max-h-96 rounded-lg object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full max-h-96 rounded-lg object-cover"
                    loading="lazy"
                    onClick={() => setModalImage(post.mediaUrl!)}
                  />
                )}
              </div>
            )}

            {/* Like Button */}
            <div className="flex items-center space-x-6 mb-5">
              <button
                onClick={() => likePost(post._id)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                aria-label="Like post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill={post.likes && post.likes > 0 ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>{post.likes ?? 0} Like{post.likes === 1 ? '' : 's'}</span>
              </button>
            </div>

            {/* Comments */}
            <section>
              <h4 className="text-gray-900 font-semibold mb-3 border-b border-gray-200 pb-2 text-lg">
                Comments ({post.comments?.length ?? 0})
              </h4>

              {post.comments?.length === 0 && (
                <p className="text-gray-500 italic mb-4">No comments yet. Be the first!</p>
              )}

              <ul className="space-y-4 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                {post.comments?.map((comment, idx) => (
                  <li
                    key={idx}
                    className="flex space-x-3 p-3 rounded-lg bg-indigo-50/30 border border-indigo-100"
                  >
                    {comment.commenterImage ? (
                      <img
                        src={comment.commenterImage}
                        alt={comment.commenterName}
                        className="w-10 h-10 rounded-full object-cover border border-indigo-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center text-white font-bold">
                        {comment.commenterName?.[0]?.toUpperCase() || 'A'}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <p className="text-indigo-900 font-semibold">{comment.commenterName}</p>
                      <p className="text-xs text-gray-400 mb-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Comment Input */}
              {isSignedIn && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addComment(post._id);
                  }}
                  className="mt-5 flex space-x-3"
                >
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentTexts[post._id] || ''}
                    onChange={(e) =>
                      setCommentTexts((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    className="flex-grow border border-indigo-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Send
                  </button>
                </form>
              )}
              {!isSignedIn && (
                <p className="text-sm text-gray-500 italic mt-3">
                  Sign in to like and comment on posts.
                </p>
              )}
            </section>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
        >
          <img src={modalImage} alt="Full view" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </>
  );
};

export default PostList;
