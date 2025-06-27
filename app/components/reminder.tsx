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

const BirthdayBanner = () => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [today, setToday] = useState(new Date());

  useEffect(() => {
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

  const formatMonthDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayMD = formatMonthDay(today.toISOString());

  const passed = birthdays.filter(b => formatMonthDay(b.birthday) < todayMD);
  const active = birthdays.filter(b => formatMonthDay(b.birthday) === todayMD);
  const upcoming = birthdays.filter(b => formatMonthDay(b.birthday) > todayMD);

  const renderBirthdayCard = (b: Birthday) => (
    <div
      key={b._id}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white shadow-md rounded-xl p-4 w-full"
    >
      {b.picture && (
        <img
          src={urlFor(b.picture).width(80).height(80).url()}
          alt={b.name}
          className="rounded-full w-20 h-20 object-cover"
        />
      )}
      <div className="text-center sm:text-left">
        <p className="font-semibold text-black text-lg sm:text-sm">{b.name}</p>
        <p className="text-gray-500">
          {new Date(b.birthday).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl max-w-5xl mx-auto text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        🎂 Birthday Reminders
      </h2>

      {active.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg sm:text-sm font-semibold mb-4">🎉 Today's Birthday</h3>
          <div className="flex flex-col gap-4">{active.map(renderBirthdayCard)}</div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">🎈 Upcoming Birthdays</h3>
          <div className="flex flex-col gap-4">{upcoming.map(renderBirthdayCard)}</div>
        </section>
      )}

      {passed.length > 0 && (
        <section>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">📅 Passed Birthdays</h3>
          <div className="flex flex-col gap-4 opacity-70">{passed.map(renderBirthdayCard)}</div>
        </section>
      )}
    </div>
  );
};

export default BirthdayBanner;
