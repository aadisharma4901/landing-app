'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    image_url?: string;
    description?: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string;
  total_price: number;
  status: string;
  products: OrderItem[];
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');

        const data = await response.json();

        console.log('Fetched orders:', data);

        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Orders fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 pt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-zinc-900">Loading orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-zinc-600 mt-2 text-lg">
              View all your purchases and payment history.
            </p>
          </div>

          <Link
            href="/products"
            className="btn-interactive inline-flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 shadow-sm">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-zinc-900">
                No Orders Yet
              </h2>

              <p className="text-zinc-600 mb-8 max-w-md mx-auto">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here.
              </p>

              <Link
                href="/products"
                className="btn-interactive inline-block px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg"
              >
                Browse Products
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <ScrollReveal key={order.id}>
                <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="p-6 sm:p-8 border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
                            Order #{order.id.slice(0, 12)}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <p className="text-zinc-500 text-sm">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-zinc-500 mb-1">Order Total</p>
                          <p className="text-2xl sm:text-3xl font-bold text-zinc-900">
                            ${Number(order.total_price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 sm:p-8">


                    <div className="space-y-4">
                      {order.products?.map((item: OrderItem, index: number) => {
                        const imageUrl = item.product?.imageUrl || item.product?.image_url || '/placeholder.png';

                        return (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-4 border border-zinc-200 rounded-2xl p-4 hover:bg-zinc-50 transition-colors"
                          >
                            {/* Product Image */}
                            <div className="w-full sm:w-32 h-32 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              {imageUrl && imageUrl !== '/placeholder.png' ? (
                                <img
                                  src={imageUrl}
                                  alt={item.product?.name || 'Product'}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <div className="text-4xl opacity-30">📦</div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg font-semibold text-zinc-900 mb-1 line-clamp-2">
                                {item.product?.name || 'Unknown Product'}
                              </h4>

                              {item.product?.description && (
                                <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
                                  {item.product.description}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-500">Quantity:</span>
                                  <span className="font-semibold text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full">
                                    {item.quantity}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-500">Price:</span>
                                  <span className="font-semibold text-zinc-900">
                                    ${Number(item.product?.price).toFixed(2)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-500">Line Total:</span>
                                  <span className="font-bold text-zinc-900">
                                    ${(Number(item.product?.price) * Number(item.quantity)).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-zinc-500 mb-1 font-medium">
                          Stripe Session ID
                        </p>
                        <p className="font-mono text-xs sm:text-sm text-zinc-900 bg-zinc-50 px-3 py-2 rounded-lg break-all select-all">
                          {order.stripe_session_id}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-zinc-500 mb-1">Order Total</p>
                        <p className="text-3xl sm:text-4xl font-bold text-zinc-900">
                          ${Number(order.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
