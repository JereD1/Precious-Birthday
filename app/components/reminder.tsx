'use client';

import React, { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/app/lib/client';
import Link from 'next/link';

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

const formatMonthDay = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getDaysUntil = (dateStr: string) => {
  const today = new Date();
  const bday = new Date(dateStr);
  const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const BirthdayBanner = () => {
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
    .sort((a, b) => formatMonthDay(a.birthday).localeCompare(formatMonthDay(b.birthday)))
    .slice(0, 5);
  const passed = birthdays
    .filter((b) => formatMonthDay(b.birthday) < todayMD)
    .slice(0, 3);

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
        className={`flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 ${
          variant === 'today'
            ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
            : variant === 'upcoming'
            ? 'hover:bg-gray-800/60 border border-transparent hover:border-gray-700'
            : 'hover:bg-gray-800/30 border border-transparent opacity-50 hover:opacity-70'
        }`}
      >
        {/* Avatar */}
        {b.picture ? (
          <img
            src={urlFor(b.picture).width(40).height(40).url()}
            alt={b.name}
            className={`rounded-full object-cover flex-shrink-0 ${
              variant === 'today'
                ? 'w-10 h-10 ring-2 ring-pink-400 ring-offset-1 ring-offset-black'
                : 'w-9 h-9 ring-1 ring-gray-700'
            }`}
          />
        ) : (
          <div
            className={`rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-xs ${
              variant === 'today'
                ? 'w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 ring-2 ring-pink-400 ring-offset-1 ring-offset-black'
                : 'w-9 h-9 bg-gray-800'
            }`}
          >
            {b.name[0]?.toUpperCase()}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate leading-tight ${
            variant === 'today' ? 'text-white text-sm' : 'text-gray-300 text-xs'
          }`}>
            {b.name}
          </p>
          <p className={`text-xs truncate ${
            variant === 'today' ? 'text-pink-300' : 'text-gray-600'
          }`}>
            {new Date(b.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>

        {/* Badge */}
        <div className="flex-shrink-0">
          {variant === 'today' && (
            <span className="text-base">🎂</span>
          )}
          {variant === 'upcoming' && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              daysUntil === 1
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}>
              {daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden w-full">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            🎂 <span>Birthdays</span>
          </h2>
          <Link
            href="/birthdays"
            className="text-xs text-pink-500 hover:text-pink-400 font-medium transition"
          >
            See all →
          </Link>
        </div>
      </div>

      <div className="p-3">

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-24 h-2.5 bg-gray-800 rounded-full" />
                  <div className="w-16 h-2 bg-gray-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Today */}
            {active.length > 0 && (
              <section className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-pink-500 px-1 mb-1.5">
                  🎉 Today
                </p>
                <div className="space-y-1">
                  {active.map((b) => (
                    <BirthdayCard key={b._id} b={b} variant="today" />
                  ))}
                </div>
              </section>
            )}

            {active.length === 0 && (
              <div className="px-2 py-3 mb-2 text-center">
                <p className="text-gray-700 text-xs">No birthdays today 🕯️</p>
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <section className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-1 mb-1.5">
                  🎈 Upcoming
                </p>
                <div className="space-y-0.5">
                  {upcoming.map((b) => (
                    <BirthdayCard key={b._id} b={b} variant="upcoming" />
                  ))}
                </div>
              </section>
            )}

            {/* Passed */}
            {passed.length > 0 && (
              <section>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-700 px-1 mb-1.5">
                  📅 Recent
                </p>
                <div className="space-y-0.5">
                  {passed.map((b) => (
                    <BirthdayCard key={b._id} b={b} variant="default" />
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {birthdays.length === 0 && (
              <div className="py-6 text-center">
                <p className="text-2xl mb-2">🎂</p>
                <p className="text-gray-600 text-xs">No birthdays added yet</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-800">
        <Link href="/birthdays">
          <button className="w-full py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white text-xs font-semibold transition-all duration-200">
            View all birthdays 🎈
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BirthdayBanner;