'use client';
import { useEffect, useState } from 'react';
import { client } from '@/app/lib/client';
import { getPostsQuery } from '@/app/lib/queries';
import { useUser } from '@clerk/nextjs';

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
    if (!text) return;

    if (!isSignedIn || !user) {
      alert('You must be signed in to comment.');
      return;
    }

    const comment: Comment = {
      commenterId: user.id,
      commenterName: user.fullName || user.firstName || 'Anonymous',
      commenterImage: user.imageUrl || '',
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        <span className="ml-4 text-indigo-700 font-semibold">Loading posts...</span>
      </div>
    );

  return (
    <div className="space-y-10 mt-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {posts.map((post) => (
        <article
          key={post._id}
          className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 p-7 flex flex-col"
        >
          <header className="flex items-center space-x-4 mb-6">
            <img
              src={post.authorImage || '/default-avatar.png'}
              alt={post.authorName}
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
              loading="lazy"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{post.authorName}</h2>
              <time
                className="text-xs text-gray-400"
                dateTime={post.createdAt}
                title={new Date(post.createdAt).toLocaleString()}
              >
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
          </header>

          <p className="text-gray-800 text-base mb-5 whitespace-pre-line leading-relaxed">{post.content}</p>

          {post.mediaUrl && (
            <div className="mb-7 rounded-2xl overflow-hidden shadow-sm">
              {post.mediaUrl.match(/\.(mp4|webm)$/) ? (
                <video
                  controls
                  src={post.mediaUrl}
                  className="w-full max-h-[24rem] rounded-2xl object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="w-full max-h-[24rem] rounded-2xl object-cover"
                  loading="lazy"
                />
              )}
            </div>
          )}

          <div className="flex items-center space-x-5 mb-8">
            <button
              onClick={() => likePost(post._id)}
              aria-label="Like post"
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill={post.likes && post.likes > 0 ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>{post.likes ?? 0} Like{post.likes === 1 ? '' : 's'}</span>
            </button>
          </div>

          <section>
            <h3 className="text-gray-900 font-semibold mb-4 text-lg border-b border-gray-200 pb-2">
              Comments ({post.comments?.length ?? 0})
            </h3>

            {post.comments?.length === 0 && (
              <p className="text-gray-500 italic mb-6">No comments yet. Be the first!</p>
            )}

            <ul className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 mb-6">
              {post.comments?.map((comment, idx) => (
                <li
                  key={idx}
                  className="flex space-x-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200"
                >
                  {comment.commenterImage ? (
                    <img
                      src={comment.commenterImage}
                      alt={comment.commenterName}
                      className="w-12 h-12 rounded-full object-cover border border-indigo-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-400 flex items-center justify-center text-white font-semibold text-lg">
                      {comment.commenterName?.[0]?.toUpperCase() || 'A'}
                    </div>
                  )}
                  <div>
                    <p className="text-indigo-900 font-semibold">{comment.commenterName}</p>
                    <time
                      className="text-xs text-gray-400 mb-1 block"
                      dateTime={comment.createdAt}
                      title={new Date(comment.createdAt).toLocaleString()}
                    >
                      {new Date(comment.createdAt).toLocaleString()}
                    </time>
                    <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addComment(post._id);
              }}
              className="flex space-x-4"
            >
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentTexts[post._id] || ''}
                onChange={(e) =>
                  setCommentTexts((prev) => ({ ...prev, [post._id]: e.target.value }))
                }
                disabled={!isSignedIn}
                className="flex-grow rounded-full border border-indigo-300 px-5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 shadow-sm"
              />
              <button
                type="submit"
                disabled={!isSignedIn || !commentTexts[post._id]?.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-white font-semibold transition"
              >
                Post
              </button>
            </form>
          </section>
        </article>
      ))}
    </div>
  );
};

export default PostList;
