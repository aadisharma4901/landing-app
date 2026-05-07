'use client';

import { useState } from 'react';
import { Order } from './types';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const totalProducts = order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Main Card - Always Visible */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left side - Order basic info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-zinc-900">
                Order #{order.id.slice(0, 12)}
              </h3>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(order.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {totalProducts} item{totalProducts !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Right side - Total and expand icon */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-2xl font-bold text-zinc-900">
                {formatCurrency(order.total_price)}
              </p>
            </div>
            <button
              className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              aria-label={isExpanded ? 'Collapse order details' : 'Expand order details'}
            >
              <svg
                className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Order Details */}
      {isExpanded && (
        <div className="border-t border-zinc-200 bg-zinc-50 p-5">
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Order Items
            </h4>

            {order.products && order.products.length > 0 ? (
              <div className="space-y-3">
                {order.products.map((item, index) => {
                  const imageUrl = item.product?.imageUrl || item.product?.image_url;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product?.name || 'Product'}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-2xl opacity-30">📦</div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-zinc-900 text-sm sm:text-base line-clamp-2">
                          {item.product?.name || 'Unknown Product'}
                        </h5>
                        {item.product?.description && (
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                            {item.product.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="inline-flex items-center px-2 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-full">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-zinc-900">
                            {formatCurrency(item.product?.price || 0)}
                          </span>
                          <span className="text-sm text-zinc-500">
                            × {item.quantity} = <span className="font-bold text-zinc-900">{formatCurrency((item.product?.price || 0) * item.quantity)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">No items in this order</p>
            )}

            {/* Order Footer Details */}
            <div className="mt-6 pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Stripe Session ID</p>
                <p className="font-mono text-xs sm:text-sm text-zinc-900 bg-white px-3 py-2 rounded-lg border border-zinc-200 break-all select-all">
                  {order.stripe_session_id}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-zinc-500 mb-1">Order Total</p>
                <p className="text-3xl font-bold text-zinc-900">
                  {formatCurrency(order.total_price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
