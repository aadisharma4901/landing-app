'use client';

import { Order } from './types';
import OrdersList from './OrdersList';

interface DashboardOrdersProps {
  userId: string;
  isLoading?: boolean;
}

export default function DashboardOrders({ userId, isLoading = false }: DashboardOrdersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Order History
        </h2>
      </div>
      <OrdersList userId={userId} />
    </div>
  );
}
