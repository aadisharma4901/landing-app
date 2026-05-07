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

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

function buildSessionMetadata(
  items: CheckoutLineItem[],
  userId?: string | null,
  mode?: string,
  customer?: CustomerDetails | null
) {
  return {
    ...(userId ? { userId } : {}),
    ...(mode ? { checkoutMode: mode } : {}),
    ...(customer ? { customerName: customer.fullName, customerEmail: customer.email, customerPhone: customer.phone, customerAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip}` } : {}),
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
  mode?: string,
  customer?: CustomerDetails | null
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
    metadata: buildSessionMetadata(items, userId, mode, customer),
  });

  return session;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json().catch(() => ({}));
    const productId = body.productId ? Number(body.productId) : null;
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const cartItems = body.cartItems as Array<{ productId: number; quantity: number }> | undefined;
    const customer = body.customerDetails as CustomerDetails | undefined;

    console.log('Checkout POST - userId:', userId, 'productId:', productId, 'quantity:', quantity);

    // BUY NOW mode: single product checkout from product detail page
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
        'buy_now',
        customer || null
      );

      return NextResponse.json({ url: session.url });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // CART CHECKOUT: use cart items sent from frontend
    if (cartItems && cartItems.length > 0) {
      const productIds = cartItems.map(i => i.productId);
      const { data: products, error: productsError } = await supabaseServer
        .from('products')
        .select('id, name, price, original_price, image_url, description')
        .in('id', productIds);

      if (productsError) {
        console.error('Error fetching products for checkout:', productsError);
        return NextResponse.json(
          { error: 'Failed to fetch product details', details: productsError.message },
          { status: 500 }
        );
      }

      const productMap = new Map(products?.map(p => [p.id, p]) || []);
      const checkoutItems: CheckoutLineItem[] = [];

      for (const item of cartItems) {
        const product = productMap.get(Number(item.productId));
        if (product) {
          checkoutItems.push({
            product: product as CheckoutProduct,
            quantity: item.quantity,
          });
        }
      }

      if (checkoutItems.length === 0) {
        return NextResponse.json(
          { error: 'No valid products found in cart' },
          { status: 400 }
        );
      }

      const session = await createCheckoutSession(req, checkoutItems, userId, 'cart', customer || null);

      console.log('Checkout - Session created:', session.id, 'URL:', session.url);
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: 'Cart is empty. Please add items to your cart first.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Checkout error details:', {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      stack: error?.stack,
    });
    const errorMessage = error?.message || 'Failed to create checkout session';
    if (error?.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Stripe API key is not configured properly. Please check STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}