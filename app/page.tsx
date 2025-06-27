'use client';

import { useState } from 'react';
import Link from 'next/link';
import FeedPage from './components/feed';
import Menu from '@/app/pages/menu';
import Event from '@/app/pages/event';
import CreatePostModal from '@/app/components/createPostModal'; // adjust path if needed

export default function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleViewPosts = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = () => {
    setIsCreateOpen(true);
  };

  return (
    <>
      <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-white text-gray-900">

        {/* Desktop Left Sidebar */}
        <aside className="hidden md:block fixed left-0 top-0 h-full w-1/4 p-4 bg-gray-50 border-r border-gray-200 z-10">
          <Menu />
        </aside>

        {/* Desktop Right Sidebar */}
        <aside className="hidden md:block fixed right-0 top-0 h-full w-1/4 p-4 bg-gray-50 border-l border-gray-200 z-10">
          <Event />
        </aside>

        {/* Center Feed - always visible, full height, scrollable */}
        <div className="flex-1 h-full overflow-y-auto bg-stone-200 p-4 md:mx-[25%]">
          <div className="max-w-2xl mx-auto">
            <FeedPage />
          </div>
        </div>

        {/* Mobile Bottom nav: HIDDEN */}
        {/* <nav className="fixed bottom-0 left-0 right-0 flex md:hidden justify-around items-center bg-gray-50 border-t border-gray-200 p-2 z-20 shadow-inner">
          <div className="w-1/2 p-1">
            <Menu />
          </div>
          <div className="w-1/2 p-1 border-l border-gray-200">
            <Event />
          </div>
        </nav> */}

        {/* Mobile floating action buttons */}
        <div className="fixed bottom-4 right-4 flex flex-col space-y-4 md:hidden z-30">
          <Link href="/birthdays">
          <button
            onClick={handleViewPosts}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            aria-label="View Posts"
            title="View Posts"
          >
            📃
          </button>
          </Link>
          <button
            onClick={handleCreatePost}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            aria-label="Create Post"
            title="Create Post"
          >
            ➕
          </button>
        </div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
