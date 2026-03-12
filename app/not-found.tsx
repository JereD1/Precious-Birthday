// app/not-found.tsx  ← Next.js automatically uses this as the 404 page
'use client'
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden relative">

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">

        {/* Animated cake */}
        <div className="relative inline-block mb-6">
          <div
            className="text-8xl select-none"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            🎂
          </div>
          {/* Floating confetti pieces */}
          {['🎈', '✨', '🎉', '⭐', '🎊'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-xl select-none"
              style={{
                top: `${['-20%', '10%', '-30%', '60%', '80%'][i]}`,
                left: `${['-30%', '110%', '100%', '-40%', '90%'][i]}`,
                animation: `float ${2.5 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.7,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* 404 number */}
        <div className="relative mb-2">
          <p
            className="text-[120px] font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: '"Georgia", serif',
              letterSpacing: '-4px',
            }}
          >
            404
          </p>
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold text-white mb-3 tracking-tight"
          style={{ fontFamily: '"Georgia", serif' }}
        >
          This page doesn't exist... yet
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Looks like this page is still under construction — or maybe it never existed at all.
          Either way, there's no cake here. 🕯️
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs uppercase tracking-widest">lost?</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-full transition-all duration-200 shadow-lg shadow-pink-900/40 hover:shadow-pink-900/60 hover:scale-105 active:scale-95">
              🏠 Go Home
            </button>
          </Link>
          <Link href="/birthdays">
            <button className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95">
              🎂 See Birthdays
            </button>
          </Link>
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-gray-700 text-xs">
          BirthdaySpace · Page not found
        </p>
      </div>

      {/* Float keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
      `}</style>
    </main>
  );
}