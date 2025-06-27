'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreatePostModal from '../components/createPostModal';

import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';

const Menu = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleCreatePostClick = () => {
    if (isSignedIn) {
      setModalOpen(true);
    } else {
      router.push('/login');
    }
  };

  const handleHomeClick = () => {
    router.refresh(); // Refreshes the current route
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-200 via-pink-100 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-6 text-center">
        {/* Home Button */}
        <button
          onClick={handleHomeClick}
          className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition duration-200 cursor-pointer"
        >
          🏢 Home
        </button>

        {/* Auth Buttons */}
        <SignedOut>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-medium text-sm px-5 py-2 transition">
                Sign Up
              </button>
            </Link>

            <Link href="/login">
              <button className="bg-[#6c47ff] hover:bg-[#5536d6] text-white rounded-full font-medium text-sm px-5 py-2 transition">
                Login
              </button>
            </Link>
          </div>
        </SignedOut>

        {/* User Button */}
        <SignedIn>
          <div className="flex justify-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        {/* Create Post */}
        <button
          onClick={handleCreatePostClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition duration-300 shadow-md"
        >
          + Create Post
        </button>

        <CreatePostModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
};

export default Menu;
