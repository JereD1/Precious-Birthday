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
  likes?: string[];
  comments?: Comment[];
};

const formatPostDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const isThisYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleString(undefined, {
    year: isThisYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PostList = () => {
  const { user, isSignedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState<{ [postId: string]: string }>({});
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<Set<string>>(new Set());

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
    if (!isSignedIn) return alert('Sign in to like posts.');
    const post = posts.find((p) => p._id === postId);
    if (post?.likes?.includes(user.id)) return;

    try {
      await client.patch(postId).setIfMissing({ likes: [] }).append('likes', [user.id]).commit();
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: [...(p.likes ?? []), user.id] } : p
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
      await client.patch(postId).setIfMissing({ comments: [] }).append('comments', [comment]).commit();
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: [...(p.comments ?? []), comment] } : p
        )
      );
      setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  // ── LOADING SKELETON ──
  if (loading) {
    return (
      <div className="divide-y divide-gray-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-5 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="w-28 h-3 bg-gray-800 rounded-full" />
                  <div className="w-16 h-3 bg-gray-800 rounded-full" />
                </div>
                <div className="w-full h-3 bg-gray-800 rounded-full" />
                <div className="w-3/4 h-3 bg-gray-800 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── EMPTY STATE ──
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🎈</p>
        <p className="text-gray-500 font-medium">No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <>
      {/* Posts — Twitter-style dividers, no cards */}
      <div className="divide-y divide-gray-800">
        {posts.map((post) => {
          const isLiked = isSignedIn ? (post.likes?.includes(user.id) ?? false) : false;
          const likeCount = post.likes?.length ?? 0;
          const commentsOpen = openComments.has(post._id);
          const commentCount = post.comments?.length ?? 0;

          return (
            <article
              key={post._id}
              className="px-4 py-4 hover:bg-white/[0.02] transition-colors duration-150 cursor-pointer"
            >
              {/* Author row */}
              <div className="flex gap-3">
                {/* Avatar */}
                <img
                  src={post.authorImage || '/default-avatar.png'}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-700"
                />

                {/* Right side */}
                <div className="flex-1 min-w-0">
                  {/* Name + date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white text-sm">{post.authorName}</p>
                    <span className="text-gray-500 text-xs">·</span>
                    <p className="text-gray-500 text-xs">{formatPostDate(post.createdAt)}</p>
                  </div>

                  {/* Content */}
                  <p className="text-gray-200 text-sm mt-1 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Media */}
                  {post.mediaUrl && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
                      {post.mediaUrl.endsWith('.mp4') || post.mediaUrl.endsWith('.webm') ? (
                        <video controls src={post.mediaUrl} className="w-full max-h-80 object-cover" />
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt="Post media"
                          className="w-full max-h-80 object-cover cursor-zoom-in hover:opacity-90 transition"
                          loading="lazy"
                          onClick={() => setModalImage(post.mediaUrl!)}
                        />
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 mt-3 -ml-2">
                    {/* Like */}
                    <button
                      onClick={() => likePost(post._id)}
                      disabled={isLiked}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isLiked
                          ? 'text-pink-500 cursor-default'
                          : 'text-gray-500 hover:text-pink-500 hover:bg-pink-500/10'
                      }`}
                    >
                      <span className="text-base">{isLiked ? '❤️' : '🤍'}</span>
                      <span>{likeCount}</span>
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    >
                      <span className="text-base">💬</span>
                      <span>{commentCount}</span>
                    </button>
                  </div>

                  {/* Comments section */}
                  {commentsOpen && (
                    <div className="mt-3 border-t border-gray-800 pt-3">
                      {/* Comment list */}
                      {commentCount > 0 && (
                        <ul className="space-y-3 max-h-56 overflow-y-auto mb-3">
                          {post.comments?.map((comment, idx) => (
                            <li key={idx} className="flex gap-2.5">
                              {comment.commenterImage ? (
                                <img
                                  src={comment.commenterImage}
                                  alt={comment.commenterName}
                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                  {comment.commenterName?.[0]?.toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 bg-gray-900 rounded-2xl px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-bold text-white">{comment.commenterName}</p>
                                  <span className="text-gray-600 text-[10px]">·</span>
                                  <p className="text-[10px] text-gray-500">{formatPostDate(comment.createdAt)}</p>
                                </div>
                                <p className="text-xs text-gray-300 mt-0.5 leading-relaxed">{comment.text}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {commentCount === 0 && (
                        <p className="text-xs text-gray-600 italic mb-3">No comments yet — say something! 🎉</p>
                      )}

                      {/* Comment input */}
                      {isSignedIn ? (
                        <form
                          onSubmit={(e) => { e.preventDefault(); addComment(post._id); }}
                          className="flex gap-2 items-center"
                        >
                          <img
                            src={user?.imageUrl}
                            alt="You"
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              placeholder="Post your reply..."
                              value={commentTexts[post._id] || ''}
                              onChange={(e) =>
                                setCommentTexts((prev) => ({ ...prev, [post._id]: e.target.value }))
                              }
                              className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition"
                            />
                            <button
                              type="submit"
                              disabled={!commentTexts[post._id]?.trim()}
                              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-full hover:from-pink-600 hover:to-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                              Reply
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-xs text-gray-600 italic text-center py-1">
                          <a href="/login" className="text-pink-500 hover:underline font-semibold">Sign in</a> to reply.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <img
            src={modalImage}
            alt="Full view"
            className="max-w-full max-h-full rounded-2xl object-contain"
          />
          <button
            onClick={() => setModalImage(null)}
            className="absolute top-4 right-4 w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white text-sm transition"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default PostList;