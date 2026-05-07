'use client';

import { User } from '@clerk/nextjs/server';

interface ProfileCardProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageUrl: string | null;
  } | null;
  isLoading?: boolean;
}

export default function ProfileCard({ user, isLoading = false }: ProfileCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-zinc-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-zinc-200 rounded w-32"></div>
            <div className="h-4 bg-zinc-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';

  // Since we don't have createdAt from useUser, show placeholder or leave out
  const memberSince = 'Member';

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Profile Image */}
        <div className="relative">
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-zinc-100 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">
                {fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white">
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-zinc-900">
            {fullName}
          </h2>
          <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
          <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 bg-zinc-100 rounded-full">
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium text-zinc-600">
              {memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
