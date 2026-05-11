'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Products", href: "/products" },
  { name: "Deals", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Support", href: "/contact" },
];

function CartIcon() {
  const { totalItems } = useCart();
  return (
    <Link href="/cart" className="btn-interactive relative p-2 rounded-full bg-zinc-100">
      <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  const isDashboard = pathname.startsWith('/dashboard');
  const [isScrolled, setIsScrolled] = useState(false);

  // Prevent rendering on the server to avoid a flash of the client navbar on
  // admin routes. The component will render only on the client, where the
  // pathname check can correctly hide it for `/admin/*` URLs.
  if (typeof window === 'undefined') {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide the navbar on both the client dashboard and any admin route
  if (isDashboard || isAdminPath) {
    return null;
  }

  return (
    <>
       <nav
         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
           isScrolled
             ? "glass shadow-sm border-b border-white/20"
             : isAdmin
               ? "bg-indigo-50"
               : "bg-transparent"
         }`}
        style={{ transform: 'translateY(0)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="btn-interactive flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-zinc-900">Banazon</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-zinc-600 hover:text-zinc-900 transition-all duration-200 font-medium hover:-translate-y-0.5"
                >
                  {item.name}
                </Link>
              ))}

              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 rounded-full bg-zinc-100 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 w-48"
                />
                <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Cart Icon */}
              <CartIcon />

              {/* User dropdown - using Clerk's UserButton */}
              <div className="flex items-center gap-3">
                {isLoaded && user ? (
                  <>
                    <Link href="/dashboard" className="text-sm font-medium text-zinc-700 hover:text-zinc-900">
                      Dashboard
                    </Link>
                 {/* Show Admin link only for users with an admin role. */}
                 {/* Admin UI – distinct styling */}
                     {isAdmin && !isAdminPath && (
                   <div className="flex items-center space-x-2 ml-4">
                     {/* Admin link with a different color scheme */}
                     <Link
                       href="/admin"
                       className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                     >
                       Admin Panel
                     </Link>
                     {/* Optional quick‑check button */}
                     <button
                       type="button"
                       className="px-2 py-0.5 bg-indigo-200 text-indigo-800 rounded hover:bg-indigo-300"
                       onClick={() => {
                         // Simple client‑side check – could be expanded later
                         alert('You are viewing the admin panel');
                       }}
                     >
                       Check
                     </button>
                   </div>
                 )}
                    <UserButton />
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
