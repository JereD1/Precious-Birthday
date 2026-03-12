'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import CreatePostModal from '../components/createPostModal';

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleCreatePostClick = () => {
    if (isSignedIn) {
      setModalOpen(true);
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🎂</span>
              <span className="font-extrabold text-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                BirthdaySpace
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
              >
                🏠 Home
              </Link>
              <Link
                href="/birthdays"
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
              >
                🎈 Birthdays
              </Link>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <SignedOut>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-full text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200">
                    Sign Up
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200">
                    Login
                  </button>
                </Link>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={handleCreatePostClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span className="text-base">✏️</span> Create Post
                </button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-pink-50 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-pink-100 px-4 py-4 space-y-2 shadow-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
            >
              🏠 Home
            </Link>
            <Link
              href="/birthdays"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
            >
              🎈 Birthdays
            </Link>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <SignedOut>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                    Sign Up
                  </button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition">
                    Login
                  </button>
                </Link>
              </SignedOut>

              <SignedIn>
                <button
                  onClick={() => { handleCreatePostClick(); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition"
                >
                  ✏️ Create Post
                </button>
                <div className="flex justify-center pt-1">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </nav>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;