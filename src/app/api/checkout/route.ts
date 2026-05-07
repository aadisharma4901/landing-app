import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';

interface CheckoutProduct {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  description?: string | null;
}

interface CheckoutLineItem {
  product: CheckoutProduct;
  quantity: number;
}

function buildSessionMetadata(items: CheckoutLineItem[], userId?: string | null, mode?: string) {
  return {
    ...(userId ? { userId } : {}),
    ...(mode ? { checkoutMode: mode } : {}),
    items: JSON.stringify(
      items.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image_url: item.product.image_url ?? null,
        description: item.product.description ?? null,
        quantity: item.quantity,
      }))
    ),
  };
}

async function createCheckoutSession(
  req: NextRequest,
  items: CheckoutLineItem[],
  userId?: string | null,
  mode?: string
) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        description: item.product.description || '',
        images: item.product.image_url ? [item.product.image_url] : [],
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/cancel`,
    metadata: buildSessionMetadata(items, userId, mode),
  });

  return session;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json().catch(() => ({}));
    const productId = body.productId ? Number(body.productId) : null;
    const quantity = Math.max(1, Number(body.quantity) || 1);

    console.log('Checkout POST - userId:', userId, 'productId:', productId, 'quantity:', quantity);

    if (productId !== null) {
      const { data: product, error: productError } = await supabaseServer
        .from('products')
        .select('id, name, price, original_price, image_url, description')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        console.error('Buy now product error:', productError);
        return NextResponse.json(
          { error: productError?.message || 'Product not found' },
          { status: 500 }
        );
      }

      const session = await createCheckoutSession(
        req,
        [{ product: product as CheckoutProduct, quantity }],
        userId,
        'buy_now'
      );

      return NextResponse.json({ url: session.url });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Fetch cart items with product details
    console.log('Checkout - Fetching cart for user:', userId);
    const { data: cartItems, error: cartError } = await supabaseServer
      .from('cart_items')
      .select(`
        id,
        quantity,
        product:products (
          id,
          name,
          price,
          original_price,
          image_url,
          description
        )
      `)
      .eq('user_id', userId);

    console.log('Checkout cart items:', cartItems);
    console.log('Checkout cart error:', cartError);

    if (cartError) {
      console.error('Error fetching cart for checkout:', cartError);
      return NextResponse.json(
        { 
          error: 'Failed to fetch cart',
          details: cartError.message 
        },
        { status: 500 }
      );
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Convert cart items to Stripe line items
    const checkoutItems = cartItems
      .filter((item: any) => item.product !== null)
      .map((item: any) => ({
        product: item.product as CheckoutProduct,
        quantity: item.quantity,
      }));

    const session = await createCheckoutSession(req, checkoutItems, userId, 'cart');

    console.log('Checkout - Session created:', session.id, 'URL:', session.url);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
