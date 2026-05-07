'use client';

import { useEffect, useState } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { AppUser } from '@/types/user';

export default function TestPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [syncedUser, setSyncedUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    void fetch('/api/test', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch synced user');
        }

        return response.json();
      })
      .then((payload) => {
        setSyncedUser(payload.user ?? null);
      })
      .catch((error) => {
        console.error('Error loading synced user:', error);
      });
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500">Please sign in to view this page.</div>
      </div>
    );
  }

  const fullName = [syncedUser?.first_name, syncedUser?.last_name].filter(Boolean).join(' ').trim();
  const displayName = fullName || syncedUser?.email || user?.fullName || 'User';
  const displayEmail = syncedUser?.email || user?.emailAddresses[0]?.emailAddress || 'No email available';
  const displayImage = syncedUser?.image_url || user?.imageUrl;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4">
      <div className="max-w-2xl w-full glass rounded-2xl shadow-2xl border border-zinc-200/50 p-8">
        <div className="text-center mb-8">
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-4 ring-4 ring-green-100"
            />
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            Authentication Test
          </h1>
          <p className="text-zinc-600">
            You are successfully authenticated!
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-medium text-zinc-500 block mb-1">
              Synced User
            </label>
            <div className="p-3 bg-zinc-100 rounded-lg text-sm text-zinc-900">
              {displayName}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-500 block mb-1">
              Email
            </label>
            <div className="p-3 bg-zinc-100 rounded-lg font-mono text-sm text-zinc-900">
              {displayEmail}
            </div>
          </div>

          {fullName && (
            <div>
              <label className="text-sm font-medium text-zinc-500 block mb-1">
                Name
              </label>
              <div className="p-3 bg-zinc-100 rounded-lg font-mono text-sm text-zinc-900">
                {fullName}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-200">
            <label className="text-sm font-medium text-zinc-500 block mb-2">
              API Response Preview
            </label>
            <pre className="p-4 bg-zinc-900 rounded-lg text-green-400 text-sm overflow-x-auto">
              {JSON.stringify({
                user: {
                  first_name: syncedUser?.first_name ?? '',
                  last_name: syncedUser?.last_name ?? '',
                  email: displayEmail,
                  image_url: syncedUser?.image_url ?? ''
                }
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => fetch('/api/test').then(r => r.json()).then(console.log)}
            className="flex-1 btn-interactive bg-zinc-900 text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Test API
          </button>
          <SignOutButton>
            <button className="flex-1 btn-interactive bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-colors">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Visit <Link href="/api/test" className="text-blue-500 hover:underline">/api/test</Link> to see the raw JSON response.
        </p>
      </div>
    </div>
  );
}
