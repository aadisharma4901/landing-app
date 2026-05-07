'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { DashboardSection } from './types';
import { SignOutButton } from '@clerk/nextjs';

interface DashboardSidebarProps {
  onClose?: () => void;
}

const navItems: { id: DashboardSection; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'My Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  useEffect(() => {
    const sectionParam = searchParams.get('section') as DashboardSection;
    if (sectionParam && ['overview', 'orders', 'settings'].includes(sectionParam)) {
      setActiveSection(sectionParam);
    } else if (pathname === '/dashboard') {
      setActiveSection('overview');
    }
  }, [pathname, searchParams]);

  const handleNavigation = (section: DashboardSection) => {
    setActiveSection(section);
    if (onClose) {
      onClose();
    }
  };

  const getLinkHref = (section: DashboardSection) => {
    if (section === 'overview') return '/dashboard';
    if (section === 'settings') return '/dashboard?section=settings';
    return '/dashboard?section=orders';
  };

  return (
    <aside className="h-full w-64 bg-white backdrop-blur-xl border-r border-zinc-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-zinc-900">Banazon</span>
        </Link>
        <p className="text-xs text-zinc-500 mt-1">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const href = getLinkHref(item.id);

            return (
              <li key={item.id}>
                <Link
                  href={href}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200/50'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-700'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-zinc-200">
        <SignOutButton redirectUrl="/sign-in">
          <button
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl
                      text-zinc-600 hover:bg-red-50 hover:text-red-600
                      transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
