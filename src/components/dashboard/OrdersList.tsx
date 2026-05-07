'use client';

import { useState, useEffect } from 'react';
import { Order } from './types';
import OrderCard from './OrderCard';
import EmptyOrdersState from './EmptyOrdersState';

interface OrdersListProps {
  userId: string;
}

export default function OrdersList({ userId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch('/api/orders');

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Orders fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm animate-pulse">
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
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyOrdersState />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
