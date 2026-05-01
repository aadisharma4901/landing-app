'use client';

import ScrollReveal from '@/components/ScrollReveal';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="py-20">
              <div className="text-8xl mb-6">🛒</div>
              <h1 className="text-3xl font-bold text-zinc-900 mb-4">Your cart is empty</h1>
              <p className="text-lg text-zinc-600 mb-8">Looks like you haven't added any items yet.</p>
              <a 
                href="/products" 
                className="btn-interactive inline-block px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold text-lg"
              >
                Browse Products
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Shopping Cart</h1>
          <p className="text-zinc-600">{totalItems} items in your cart</p>
        </ScrollReveal>

        <div className="space-y-4 mb-8">
          {items.map(item => (
            <ScrollReveal key={item.product.id}>
              <div className="bg-white rounded-2xl border border-zinc-100 p-6 flex gap-6 items-center">
                <div className="w-24 h-24 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="text-4xl opacity-30">📦</div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 mb-1">{item.product.name}</h3>
                  <p className="text-zinc-500 text-sm mb-2">${item.product.price} each</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-zinc-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-zinc-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-zinc-900">${item.product.price * item.quantity}</span>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="bg-zinc-50 rounded-2xl p-8">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium">${totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-3 mt-3">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${totalPrice}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="btn-interactive flex-1 bg-zinc-900 text-white py-4 rounded-xl font-semibold text-lg">
                Checkout
              </button>
              <button 
                onClick={clearCart}
                className="px-6 py-4 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-100 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}