'use client';

import { useEffect, useState, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard';
import { DashboardOverview, DashboardOrders, DashboardSettings } from '@/components/dashboard';
import { UserProfile, DashboardSection } from '@/components/dashboard/types';

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get section from URL (derived state, no effect needed)
  const sectionParam = searchParams.get('section') as DashboardSection;
  const activeSection: DashboardSection = (sectionParam && ['overview', 'orders', 'settings'].includes(sectionParam))
    ? sectionParam
    : 'overview';

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const handleSectionChange = (section: DashboardSection) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', section);
    router.push(`/dashboard?${params.toString()}`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-zinc-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50/50">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">Welcome</h2>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Sign in to access your personalized dashboard, track orders, and manage your account.
          </p>
          <a
            href="/sign-in"
            className="btn-interactive inline-flex items-center space-x-2 px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-zinc-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>Sign In to Your Account</span>
          </a>
        </div>
      </div>
    );
  }

  const userProfile: UserProfile = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0]?.emailAddress || null,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
  };

  if (loading) {
    return (
      <DashboardShell user={userProfile} activeSection={activeSection}>
        <div className="space-y-8">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-zinc-200 rounded-xl"></div>
                  <div className="w-12 h-12 bg-zinc-100 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-20"></div>
                  <div className="h-8 bg-zinc-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Products Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-zinc-200 shadow-soft animate-pulse">
                <div className="w-full aspect-square bg-zinc-200 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-5 bg-zinc-200 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-soft animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-6 bg-zinc-200 rounded w-32"></div>
                      <div className="h-6 bg-zinc-200 rounded-full w-16"></div>
                    </div>
                    <div className="h-4 bg-zinc-200 rounded w-48"></div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-zinc-200 rounded w-16 ml-auto"></div>
                    <div className="h-8 bg-zinc-200 rounded w-24 ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell user={userProfile} activeSection={activeSection}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </DashboardShell>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return data ? (
          <DashboardOverview
            stats={data.stats}
            recentlyPurchased={data.recentlyPurchased || []}
          />
        ) : null;
      case 'orders':
        return <DashboardOrders userId={user.id} />;
      case 'settings':
        return <DashboardSettings user={userProfile} />;
      default:
        return data ? (
          <DashboardOverview
            stats={data.stats}
            recentlyPurchased={data.recentlyPurchased || []}
          />
        ) : null;
    }
  };

  return (
    <DashboardShell user={userProfile} activeSection={activeSection}>
      {renderSection()}
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-zinc-900">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
