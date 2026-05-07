'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from './types';
import ProfileSettingsForm from './ProfileSettingsForm';

interface DashboardSettingsProps {
  user: UserProfile | null;
  isLoading?: boolean;
}

export default function DashboardSettings({ user, isLoading = false }: DashboardSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Account Settings
        </h2>
      </div>

      {/* Profile Settings Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-soft overflow-hidden">
        <div className="p-6 sm:p-8">
          <ProfileSettingsForm
            initialFirstName={user?.firstName || null}
            initialLastName={user?.lastName || null}
            initialEmail={user?.email || null}
          />
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-soft p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Email</p>
            <p className="text-zinc-900 font-medium">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">Account Type</p>
            <p className="text-zinc-900 font-medium">Standard User</p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">Member Since</p>
            <p className="text-zinc-900 font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-sm text-zinc-500 mb-1">User ID</p>
            <p className="text-zinc-900 font-mono text-sm truncate" title={user?.id || ''}>
              {user?.id ? `${user.id.slice(0, 8)}...` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 shadow-soft p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Danger Zone
        </h3>
        <p className="text-sm text-zinc-600 mb-4 max-w-md">
          Once you delete your account, all your data will be permanently removed. This action cannot be undone.
        </p>
        <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
          Delete Account
        </button>
      </div>
    </div>
  );
}
