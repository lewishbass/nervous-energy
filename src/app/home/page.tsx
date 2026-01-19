'use client';

import GenericEdit from '@/components/generics/GenericEdit';
import { useState } from 'react';
import '@/styles/toggles.css'; // Import the external slider styles

export default function Home() {

  const PROFILE_ROUTE = '/.netlify/functions/profile';
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [location, setLocation] = useState<string>('37.600689, -77.567563');

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 tc1">Welcome Home</h1>
        <div className="grid gap-6">
          <section className="bg2 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 tc1">Featured Content</h2>
            <p className="tc2">
              Welcome to our platform. This is where youll find the latest updates and featured content.
              <br /><br />
              Coming Soon...
            </p>
          </section>
          
          <section className="bg2 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 tc1">Recent Activity</h2>
            <div className="space-y-4">
              <div className="border-b dark:border-gray-700 pb-2">
                <p className="font-medium tc2">New Book Added</p>
                <p className="text-sm tc3">2 hours ago</p>
              </div>
              <div className="border-b dark:border-gray-700 pb-2">
                <p className="font-medium tc2">Upcoming Event</p>
                <p className="text-sm tc3">1 day ago</p>
              </div>
              <div className="border-b dark:border-gray-700 pb-2">
                <p className="font-medium tc2">Tunes</p>
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/track/2B15LmC8Pp8IjVsYnt4dvE?utm_source=generator&autoplay=1&hide_cover=1"
                  width="100%"
                  height="80"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy">
                </iframe>
              </div>
            </div>
          </section>
          <section className="bg2 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 tc1">Map Test</h2>
            <div className="flex items-center gap-2 mb-4">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isEditing}
                  onChange={() => setIsEditing(!isEditing)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="tc2 text-sm">Edit Mode</span>
            </div>
            <GenericEdit
              type="location"
              editable={isEditing}
              value={location}
              placeholder={'Where are you from'}
              submitField="location"
              submitRoute={PROFILE_ROUTE}
            />

          </section>
        </div>
      </div>
    );
  }