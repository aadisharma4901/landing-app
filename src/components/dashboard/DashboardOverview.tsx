'use client';

import { DashboardStats as DashboardStatsType, RecentlyPurchasedItem } from './types';
import DashboardStats from './DashboardStats';
import RecentlyPurchasedProducts from './RecentlyPurchasedProducts';

interface DashboardOverviewProps {
  stats: DashboardStatsType;
  recentlyPurchased: RecentlyPurchasedItem[];
  isLoading?: boolean;
}

export default function DashboardOverview({ stats, recentlyPurchased, isLoading = false }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section>
        <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Overview
        </h2>
        <DashboardStats stats={stats} isLoading={isLoading} />
      </section>

      {/* Quick Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-500">Cart Items</h3>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">{stats.cartTotalItems ?? 0}</p>
          <p className="text-xs text-zinc-500 mt-1">items in cart</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-500">This Month</h3>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">${stats.monthlySpending?.toFixed(2) ?? '0.00'}</p>
          <p className="text-xs text-emerald-600 mt-1">spent this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-500">Avg Order</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-900">${stats.averageOrderValue?.toFixed(2) ?? '0.00'}</p>
          <p className="text-xs text-zinc-500 mt-1">per order</p>
        </div>
      </section>

      {/* Recently Purchased Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Recently Purchased
          </h2>
        </div>
        <RecentlyPurchasedProducts
          items={recentlyPurchased}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
