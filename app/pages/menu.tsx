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
      // Redirect to sign in page (you can customize the path)
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <Link href="/" passHref>
        <h2 className="text-lg font-semibold hover:text-blue-500 cursor-pointer">Home</h2>
      </Link>

      <SignedOut>
        <div className="flex gap-4 items-center">
          <Link href="/signup">
            <button className="bg-gray-200 text-black rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </Link>

          <Link href="/login">
            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Login
            </button>
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <button
        onClick={handleCreatePostClick}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Create Post
      </button>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Menu;
