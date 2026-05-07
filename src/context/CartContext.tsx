'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { normalizeProduct, type ProductRow } from '@/lib/products';
import type { Product } from '@/types/product';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isLoaded, isSignedIn } = useAuth();

  // Clear cart when user signs out or auth state changes to not authenticated
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !userId)) {
      // Defer state update to avoid synchronous setState in effect
      Promise.resolve().then(() => {
        setItems([]);
        setIsLoading(false);
      });
    }
  }, [isLoaded, isSignedIn, userId]);

  // Fetch cart from Supabase when user is authenticated
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cart', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const payload = await response.json();
        console.log('Fetched cart items:', payload.items);
        const data = payload.items ?? [];

        const itemsWithProducts: CartItem[] = data
            .filter((item: any) => item.product !== null)
            .map((item: any) => ({
              id: String(item.id),
              product: normalizeProduct(item.product as ProductRow),
              quantity: item.quantity,
            }));
        setItems(itemsWithProducts);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [isLoaded, isSignedIn, userId]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const payload = await response.json();
      const cartItemId = String(payload.id);
      const nextQuantity = payload.quantity;

      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);

        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, id: cartItemId, quantity: nextQuantity }
              : item
          );
        }

        return [...prev, { id: cartItemId, product, quantity: nextQuantity }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

   const removeFromCart = async (cartItemId: string) => {
     if (!userId) return;

     try {
       console.log('Deleting cart item id:', cartItemId, 'for user:', userId);
       
       const response = await fetch('/api/cart', {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ cartItemId }),
       });

       const responseBody = await response.text();
       console.log('Delete response status:', response.status, 'body:', responseBody);

       if (!response.ok) {
         console.error('Remove cart error:', responseBody);
         throw new Error(responseBody);
       }

       const payload = JSON.parse(responseBody);
       console.log('Delete success, deletedCount:', payload.deletedCount);

       setItems(prev => prev.filter(item => item.id !== cartItemId));
     } catch (error) {
       console.error('Error removing from cart:', error);
     }
   };

   const updateQuantity = async (productId: number, quantity: number) => {
     if (!userId) return;

     if (quantity <= 0) {
       const existingItem = items.find((item) => item.product.id === productId);
       if (existingItem) {
         await removeFromCart(existingItem.id);
       }
       return;
     }

     try {
       console.log('Updating quantity - productId:', productId, 'new quantity:', quantity);
       
       const response = await fetch('/api/cart', {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ productId, quantity }),
       });

       const responseBody = await response.text();
       console.log('PATCH response status:', response.status, 'body:', responseBody);

       if (!response.ok) {
         console.error('Update quantity error:', responseBody);
         throw new Error(responseBody);
       }

       const payload = JSON.parse(responseBody);
       console.log('Update success:', payload);

       setItems(prev =>
         prev.map(item =>
           item.product.id === productId
             ? { ...item, quantity: payload.quantity || quantity }
             : item
         )
       );
     } catch (error) {
       console.error('Error updating quantity:', error);
     }
   };

   const clearCart = async () => {
     if (!userId) return;

     try {
       const response = await fetch('/api/cart', {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({}),
       });

       if (!response.ok) {
         throw new Error('Failed to clear cart');
       }

       setItems([]);
     } catch (error) {
       console.error('Error clearing cart:', error);
     }
   };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
      <CartContext.Provider value={{
      items,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
