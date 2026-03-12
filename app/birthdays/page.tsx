'use client';

import React, { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/app/lib/client';

interface Birthday {
  _id: string;
  name: string;
  birthday: string;
  picture: any;
}

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const getDaysUntil = (dateStr: string) => {
  const today = new Date();
  const bday = new Date(dateStr);
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

const formatMonthDay = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function BirthdayPage() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());

  useEffect(() => {
    const query = `*[_type == "birthday"]{ _id, name, birthday, picture }`;
    client.fetch(query).then((data) => {
      setBirthdays(data);
      setLoading(false);
    });
  }, []);

  const todayMD = formatMonthDay(today.toISOString());
  const active = birthdays.filter((b) => formatMonthDay(b.birthday) === todayMD);
  const upcoming = birthdays
    .filter((b) => formatMonthDay(b.birthday) > todayMD)
    .sort((a, b) => formatMonthDay(a.birthday).localeCompare(formatMonthDay(b.birthday)));
  const passed = birthdays
    .filter((b) => formatMonthDay(b.birthday) < todayMD)
    .sort((a, b) => formatMonthDay(b.birthday).localeCompare(formatMonthDay(a.birthday)));

  const BirthdayCard = ({
    b,
    variant = 'default',
  }: {
    b: Birthday;
    variant?: 'today' | 'upcoming' | 'default';
  }) => {
    const daysUntil = getDaysUntil(b.birthday);

    return (
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
          variant === 'today'
            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 shadow-lg shadow-pink-900/20'
            : variant === 'upcoming'
            ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
            : 'bg-gray-900/50 border-gray-800/50 opacity-60'
        }`}
      >
        {/* Avatar */}
        {b.picture ? (
          <img
            src={urlFor(b.picture).width(56).height(56).url()}
            alt={b.name}
            className={`rounded-full object-cover flex-shrink-0 ${
              variant === 'today'
                ? 'w-14 h-14 ring-2 ring-pink-400 ring-offset-2 ring-offset-black'
                : 'w-12 h-12 ring-1 ring-gray-700'
            }`}
          />
        ) : (
          <div
            className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
              variant === 'today'
                ? 'w-14 h-14 text-lg bg-gradient-to-br from-pink-500 to-purple-600 ring-2 ring-pink-400 ring-offset-2 ring-offset-black'
                : 'w-12 h-12 text-sm bg-gradient-to-br from-gray-700 to-gray-600'
            }`}
          >
            {b.name[0]?.toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold truncate ${variant === 'today' ? 'text-white text-base' : 'text-gray-200 text-sm'}`}>
            {variant === 'today' && '🎉 '}{b.name}
          </p>
          <p className={`text-xs mt-0.5 ${variant === 'today' ? 'text-pink-300' : 'text-gray-500'}`}>
            {new Date(b.birthday).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Badge */}
        <div className="flex-shrink-0">
          {variant === 'today' && (
            <span className="px-3 py-1 bg-pink-500/30 text-pink-300 text-xs font-bold rounded-full border border-pink-500/40">
              Today! 🎂
            </span>
          )}
          {variant === 'upcoming' && (
            <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded-full border border-gray-700">
              {daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
            </span>
          )}
          {variant === 'default' && (
            <span className="px-3 py-1 bg-gray-800/50 text-gray-600 text-xs rounded-full border border-gray-800">
              Passed
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Ambient blobs */}
      <div className="fixed top-20 left-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            🎂 Birthdays
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-3 bg-gray-800 rounded-full" />
                  <div className="w-20 h-2 bg-gray-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Today's Birthdays */}
            {active.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-500">🎉 Today</p>
                  <span className="px-2 py-0.5 bg-pink-500/20 text-pink-400 text-xs rounded-full">{active.length}</span>
                </div>
                <div className="space-y-3">
                  {active.map((b) => <BirthdayCard key={b._id} b={b} variant="today" />)}
                </div>
              </section>
            )}

            {active.length === 0 && (
              <div className="mb-8 p-4 rounded-2xl bg-gray-900 border border-gray-800 text-center">
                <p className="text-gray-600 text-sm">No birthdays today 🕯️</p>
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">🎈 Upcoming</p>
                  <span className="px-2 py-0.5 bg-gray-800 text-gray-500 text-xs rounded-full">{upcoming.length}</span>
                </div>
                <div className="space-y-2">
                  {upcoming.map((b) => <BirthdayCard key={b._id} b={b} variant="upcoming" />)}
                </div>
              </section>
            )}

            {/* Passed */}
            {passed.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-700">📅 Passed</p>
                  <span className="px-2 py-0.5 bg-gray-900 text-gray-700 text-xs rounded-full border border-gray-800">{passed.length}</span>
                </div>
                <div className="space-y-2">
                  {passed.map((b) => <BirthdayCard key={b._id} b={b} variant="default" />)}
                </div>
              </section>
            )}

            {/* Empty state */}
            {birthdays.length === 0 && (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🎂</p>
                <p className="text-gray-500 font-medium">No birthdays added yet.</p>
                <p className="text-gray-700 text-sm mt-1">Add birthdays in your Sanity Studio.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}