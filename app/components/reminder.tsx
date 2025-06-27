'use client';

import React, { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/app/lib/client'; // your Sanity client config

interface Birthday {
  _id: string;
  name: string;
  birthday: string; // ISO date string
  picture: any;
}

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

const BirthdayBanner = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    // Fetch birthdays from Sanity
    const query = `*[_type == "birthday"]{
      _id,
      name,
      birthday,
      picture
    }`;

    client.fetch(query).then((data) => {
      setBirthdays(data);
      setToday(new Date());
    });
  }, []);

  // Helper: format a date string MM-DD for comparing birthdays ignoring year
  const formatMonthDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Today in MM-DD format
  const todayMD = formatMonthDay(today.toISOString());

  // Sort birthdays into passed, active, upcoming based on MM-DD comparison ignoring year
  const passed = birthdays.filter(b => formatMonthDay(b.birthday) < todayMD);
  const active = birthdays.filter(b => formatMonthDay(b.birthday) === todayMD);
  const upcoming = birthdays.filter(b => formatMonthDay(b.birthday) > todayMD);

  const renderBirthdayCard = (b: Birthday) => (
    <div key={b._id} className="flex items-center space-x-4 bg-white shadow rounded p-4">
      {b.picture && (
        <img
          src={urlFor(b.picture).width(80).height(80).url()}
          alt={b.name}
          className="rounded-full w-20 h-20 object-cover"
        />
      )}
      <div>
        <p className="font-semibold text-black text-lg">{b.name}</p>
        <p className="text-gray-500">{new Date(b.birthday).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6">Birthday Reminders</h2>

      {active.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Today's Birthday 🎉</h3>
          <div className="space-y-4">
            {active.map(renderBirthdayCard)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Upcoming Birthdays 🎈</h3>
          <div className="space-y-4">
            {upcoming.map(renderBirthdayCard)}
          </div>
        </section>
      )}

      {passed.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-2">Passed Birthdays</h3>
          <div className="space-y-4 opacity-70">
            {passed.map(renderBirthdayCard)}
          </div>
        </section>
      )}
    </div>
  );
};

export default BirthdayBanner;
