"use client";
import { useState } from 'react';
import WeatherWidget from '@/components/WeatherWidget';

interface Event {
  name: string;
  date: string;
  location: string;
}

// @ts-expect-error jsx usage
export default function Events(): JSX.Element {
  const events: Event[] = [
    { name: 'Summer Festival', date: '2024-07-15', location: 'Central Park' },
    { name: 'Tech Conference', date: '2024-08-20', location: 'Convention Center' },
    { name: 'Book Reading', date: '2024-09-05', location: 'City Library' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 tc1">Events</h1>

      {/* Weather Widget Component */}
      <WeatherWidget className="mb-6" />

      <div className="grid gap-4">
        {events.map((event, index) => (
          <div key={index} className="bg2 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2 tc1">{event.name}</h2>
            <p className="tc2">{event.date}</p>
            <p className="tc3">{event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}