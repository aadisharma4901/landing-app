'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function UserSyncProvider() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    void fetch('/api/sync-user', {
      method: 'POST',
    }).catch((error) => {
      console.error('Error syncing user:', error);
    });
  }, [isLoaded, isSignedIn, userId]);

  return null;
}
