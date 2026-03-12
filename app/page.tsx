'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import FeedPage from './components/feed';
import Event from '@/app/pages/event';
import CreatePostModal from '@/app/components/createPostModal';

const navItems = [
  { icon: '🏠', label: 'Home', href: '/' },
  { icon: '🎂', label: 'Birthdays', href: '/birthdays' },
  { icon: '🔔', label: 'Notifications', href: '/notifications' },
  { icon: '🔖', label: 'Bookmarks', href: '/bookmarks' },
  { icon: '👤', label: 'Profile', href: '/profile' },
];

// Mobile bottom tab items (5 max like Twitter)
const mobileTabItems = [
  { icon: '🏠', href: '/' },
  { icon: '🔍', href: '/search' },
  { icon: '🎂', href: '/birthdays' },
  { icon: '🔔', href: '/notifications' },
  { icon: '✉️', href: '/messages' },
];

export default function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleCreatePost = () => {
    if (isSignedIn) {
      setIsCreateOpen(true);
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white flex justify-center">
        <div className="flex w-full max-w-7xl">

          {/* ── LEFT SIDEBAR (desktop only) ── */}
          <aside className="hidden md:flex sticky top-0 h-screen flex-col justify-between py-4
            w-16 lg:w-64 xl:w-72
            flex-shrink-0 border-r border-gray-800 px-2 lg:px-4">

            {/* Top: Logo + Nav */}
            <div>
              <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-2 rounded-full hover:bg-gray-900 transition w-fit">
                <span className="text-2xl">🎂</span>
                <span className="hidden lg:block font-extrabold text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  BirthdaySpace
                </span>
              </Link>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-3 py-3 rounded-full transition group w-fit lg:w-full ${
                      pathname === item.href
                        ? 'font-bold text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="hidden lg:block text-base font-medium">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Create Post Button */}
              <button
                onClick={handleCreatePost}
                className="mt-4 w-12 h-12 lg:w-full lg:h-auto flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-full lg:py-3 lg:px-6 transition shadow-lg"
              >
                <span className="text-lg lg:text-base">✏️</span>
                <span className="hidden lg:block">Create Post</span>
              </button>
            </div>

            {/* Bottom: User */}
            <div>
              <SignedIn>
                <div className="flex items-center gap-3 px-3 py-3 rounded-full hover:bg-gray-900 transition cursor-pointer">
                  <UserButton afterSignOutUrl="/" />
                  <div className="hidden lg:block min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-gray-500 truncate">@{user?.username || 'user'}</p>
                  </div>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="hidden lg:flex flex-col gap-2">
                  <Link href="/login">
                    <button className="w-full py-2 rounded-full border border-gray-600 text-sm font-semibold text-white hover:bg-gray-900 transition">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="w-full py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
                <div className="lg:hidden flex justify-center">
                  <Link href="/login">
                    <button className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-900 transition">
                      🔑
                    </button>
                  </Link>
                </div>
              </SignedOut>
            </div>
          </aside>

          {/* ── CENTER FEED ── */}
          <section className="flex-1 min-h-screen border-r border-gray-800 overflow-y-auto pb-20 md:pb-0">
            {/* Feed Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
              <h1 className="text-lg font-extrabold text-white">🎉 For You</h1>
            </div>

            <div className="px-4">
              <FeedPage />
            </div>
          </section>

          {/* ── RIGHT SIDEBAR (large screens only) ── */}
          <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0 px-4 py-4 sticky top-0 h-screen overflow-y-auto">
            <Event />
          </aside>

        </div>
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-black border-t border-gray-800">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileTabItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-gray-500 hover:text-white hover:bg-gray-900'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
            </Link>
          ))}
        </div>
      </nav>

      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}