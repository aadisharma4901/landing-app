'use client';

import { User } from '@clerk/nextjs/server';
import Link from 'next/link';

interface DashboardHeaderProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageUrl: string | null;
  } | null;
  activeSection: string;
  onMenuToggle: () => void;
}

export default function DashboardHeader({ user, activeSection, onMenuToggle }: DashboardHeaderProps) {
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      overview: 'Overview',
      orders: 'My Orders',
      cart: 'Shopping Cart',
      wishlist: 'Wishlist',
      settings: 'Account Settings',
    };
    return titles[section] || 'Dashboard';
  };

  return (
    <header className="bg-white backdrop-blur-xl border-b border-zinc-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and Back to Home */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-100 transition-colors"
              onClick={onMenuToggle}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Back to Home link */}
            <Link
              href="/"
              className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </Link>
          </div>

          {/* Page Title */}
          <h1 className="text-lg font-semibold text-zinc-900 hidden sm:block">
            {getSectionTitle(activeSection)}
          </h1>

           {/* Right side - User info */}
           <div className="flex items-center space-x-4">
             {user?.imageUrl ? (
               <img
                 src={user.imageUrl}
                 alt={fullName}
                 className="w-8 h-8 rounded-full object-cover border-2 border-zinc-200"
               />
             ) : (
               <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">
                 {fullName.charAt(0).toUpperCase()}
               </div>
             )}
             <span className="hidden sm:block text-sm font-medium text-zinc-700">
               {fullName}
             </span>
           </div>
        </div>
      </div>
    </header>
  );
}
