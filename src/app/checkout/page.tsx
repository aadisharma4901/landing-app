'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ScrollReveal from '@/components/ScrollReveal';
import { useCart } from '@/context/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#18181b',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      '::placeholder': { color: '#a1a1aa' },
    },
    invalid: { color: '#ef4444' },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardError, setCardError] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: 'testing@gmail.com',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const downloadInvoice = () => {
    const invoice = `
              INVOICE
  Customer: ${customerName}
  Email: testing@gmail.com
  Order ID: ${orderId}
  Transaction ID: ${transactionId}
  Date: ${new Date().toLocaleDateString()}
  Time: ${new Date().toLocaleTimeString()}
  
  ─────────────────────────
  Items Purchased:
  ${items.map(item => `  ${item.product.name} x${item.quantity}  $${(item.product.price * item.quantity).toFixed(2)}`).join('\n')}
  ─────────────────────────
  
  Subtotal: $${paidAmount.toFixed(2)}
  Shipping: Free
  Total: $${paidAmount.toFixed(2)}
  
  Payment Status: PAID ✅
  
  Thank you for your purchase, ${customerName}!
  For support: support@example.com
      `;

    const blob = new Blob([invoice], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderId.slice(0, 12)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError('');

    try {
      // 1. Create PaymentIntent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customerDetails: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setCardError(data.error || 'Failed to start payment');
        setIsProcessing(false);
        return;
      }

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setCardError('Card element not found');
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zip,
            },
          },
        },
      });

      if (confirmError) {
        setCardError(confirmError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // 3. Confirm order on server
        const confirmResponse = await fetch('/api/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            customerDetails: formData,
          }),
        });

        const confirmData = await confirmResponse.json();
        if (!confirmResponse.ok) {
          setCardError(confirmData.error || 'Failed to save order');
          setIsProcessing(false);
          return;
        }

        // Success!
        setPaidAmount(data.amount / 100);
        setOrderId(confirmData.orderId || paymentIntent.id);
        setCustomerName(formData.fullName);
        setTransactionId(paymentIntent.id);
        setPaymentSuccess(true);
        clearCart();
      }
    } catch (error: any) {
      setCardError(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // SUCCESS VIEW
  if (paymentSuccess) {
    return (
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-xl text-zinc-600 mb-8">
              Thank you, <strong>{customerName}</strong>! Your order has been placed.
            </p>

            <div className="bg-zinc-50 rounded-2xl p-8 mb-8 text-left">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Confirmation</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Customer</span>
                  <span className="font-medium text-zinc-900">{customerName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Email</span>
                  <span className="font-medium text-zinc-900">testing@gmail.com</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Transaction ID</span>
                  <span className="font-medium text-zinc-900 font-mono text-sm">{transactionId.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-200">
                  <span className="text-zinc-600">Total Paid</span>
                  <span className="font-bold text-lg text-green-600">${paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-600">Payment Status</span>
                  <span className="font-medium text-green-600">Paid ✅</span>
                </div>
              </div>
            </div>

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
                Go Home
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
    );
  }

  // EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="py-20">
              <div className="text-8xl mb-6">🛒</div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">Your cart is empty</h1>
              <p className="text-lg text-zinc-600 mb-8">Add items to your cart before checking out.</p>
              <Link
                href="/products"
                className="btn-interactive inline-block px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg"
              >
                Browse Products
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-400 bg-red-50' : 'border-zinc-200'} focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all`;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Checkout</h1>
          <p className="text-zinc-600">Complete your purchase securely</p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Billing Form + Card */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Billing Details</h2>

                {/* Full Name */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className={inputClass('fullName')} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                  <input type="email" value={formData.email} className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed" disabled />
                  <p className="text-xs text-zinc-400 mt-1">Pre-filled for testing</p>
                </div>

                {/* Phone */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputClass('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street, Apt 4B" className={inputClass('address')} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* City, State, ZIP */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="New York" className={inputClass('city')} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="NY" className={inputClass('state')} />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">ZIP Code</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="10001" className={inputClass('zip')} />
                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                  </div>
                </div>

                {/* Card Payment Section */}
                <div className="border-t border-zinc-100 pt-6 mb-6">
                  <h3 className="text-lg font-bold text-zinc-900 mb-4">💳 Card Payment</h3>

                  <div className="bg-zinc-50 rounded-xl p-4 mb-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Card Details</label>
                    <div className="bg-white rounded-lg border border-zinc-200 p-3">
                      <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>

                  {cardError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                      <p className="text-red-600 text-sm">{cardError}</p>
                    </div>
                  )}

                  {/* Test Card Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-900 mb-2">🧪 Test Card (Sandbox)</h4>
                    <div className="text-xs text-blue-800 space-y-1 font-mono">
                      <div><strong>Card:</strong> 4242 4242 4242 4242</div>
                      <div><strong>Expiry:</strong> Any future date (e.g., 12/30)</div>
                      <div><strong>CVC:</strong> Any 3 digits (e.g., 123)</div>
                      <div><strong>ZIP:</strong> Any 5 digits</div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!stripe || isProcessing}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay $${totalPrice} — Place Order`
                  )}
                </button>

                <p className="text-xs text-zinc-400 text-center mt-3">
                  🔒 Secured by Stripe. Your card details are encrypted.
                </p>
              </form>
            </ScrollReveal>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm sticky top-28">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <div className="text-2xl opacity-30">📦</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-zinc-500">Qty: {item.quantity} × ${item.product.price}</p>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 pt-3 mt-3">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="font-bold text-lg text-zinc-900">${totalPrice}</span>
                  </div>
                </div>

                <Link
                  href="/cart"
                  className="block text-center text-sm text-zinc-500 hover:text-zinc-900 mt-6 underline underline-offset-2"
                >
                  ← Back to Cart
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}