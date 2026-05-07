'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [customerName, setCustomerName] = useState('Valued Customer');

  // Process successful checkout on page load - ONLY RUN ONCE
  useEffect(() => {
    if (sessionId) {
      // Call backend to process order (backend will clear cart after saving order)
      fetch(`/api/checkout/success?session_id=${sessionId}`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Order processing completed:', data);
        if (data.customerName) {
          setCustomerName(data.customerName);
        }
        // Clear frontend cart state after successful order processing
        clearCart();
      })
      .catch(err => console.error('❌ Error processing order:', err));
    }
  }, [sessionId, clearCart]);

  // Generate and download invoice
  const downloadInvoice = () => {
    if (!sessionId) return;
    
    const invoiceContent = `
            INVOICE
Customer: ${customerName}
Order ID: ${sessionId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Thank you for your purchase, ${customerName}!

Payment Status: PAID
Transaction ID: ${sessionId}

Thank you for shopping with us!
For support contact: support@example.com
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${sessionId.slice(0, 12)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
              Payment Successful!
            </h1>

            <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
              Your order has been placed successfully. Thank you for your purchase!
            </p>

            {/* Order Confirmation Box */}
            <div className="bg-zinc-50 rounded-2xl p-8 mb-8 text-left">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Confirmation</h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Transaction ID</span>
                  <span className="font-medium text-zinc-900 font-mono text-sm">
                    {sessionId ? `${sessionId.slice(0, 12)}...` : 'Processing...'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Payment Status</span>
                  <span className="font-medium text-green-600">Paid</span>
                </div>

                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Delivery Estimate</span>
                  <span className="font-medium text-zinc-900">3-5 Business Days</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-zinc-600">Confirmation Email</span>
                  <span className="font-medium text-zinc-900">Sent Instantly</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-zinc-900 mb-3">What&apos;s Next?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-zinc-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Confirmation Email</h4>
                  <p className="text-sm text-zinc-600">You&apos;ll receive order details and tracking info shortly.</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-zinc-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4-8-4m16 0V4a2 2 0 00-2-2H6a2 2 0 00-2 2v12m16 0H6" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Shipping Updates</h4>
                  <p className="text-sm text-zinc-600">Track your order in real-time from your account.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={downloadInvoice}
                className="btn-interactive inline-block px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invoice
              </button>

              <Link
                href="/products"
                className="btn-interactive inline-block px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg"
              >
                Continue Shopping
              </Link>

              <Link
                href="/"
                className="inline-block px-8 py-4 border border-zinc-300 rounded-xl font-semibold text-lg hover:bg-zinc-50 transition-colors"
              >
                Go to Home
              </Link>
            </div>

            {/* Support Info */}
            <p className="mt-8 text-sm text-zinc-500">
              Questions about your order?{' '}
              <Link href="/contact" className="text-zinc-900 underline hover:no-underline">
                Contact Support
              </Link>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-20 flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
