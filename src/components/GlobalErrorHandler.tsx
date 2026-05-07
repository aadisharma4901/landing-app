'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (ClerkJS session touch errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      // Check if it's a ClerkJS network error
      const reasonStr = reason instanceof Error ? reason.message : String(reason);

      if (reasonStr.includes('ClerkJS') && reasonStr.includes('Failed to fetch')) {
        console.debug('ClerkJS: Session touch network error (safe to ignore)');
        event.preventDefault();
        return;
      }

      // Log other unhandled errors
      console.error('Unhandled promise rejection:', reason);
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('ClerkJS') && event.message.includes('Failed to fetch')) {
        console.debug('ClerkJS: Network error ignored');
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
