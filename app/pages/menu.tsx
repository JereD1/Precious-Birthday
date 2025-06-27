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
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-200 via-pink-100 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Home Button */}
        <button
          onClick={handleHomeClick}
          className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-purple-600 transition duration-200"
        >
          🏠 Home
        </button>

        {/* Auth Buttons */}
        <SignedOut>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-medium text-sm px-5 py-2 transition duration-200">
                Sign Up
              </button>
            </Link>

            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#6c47ff] hover:bg-[#5536d6] text-white rounded-full font-medium text-sm px-5 py-2 transition duration-200">
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

        {/* Modal */}
        <CreatePostModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
};

export default Menu;
