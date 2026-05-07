import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';

function safeParseItems(value?: string | null) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function normalizeItems(rawItems: any[]) {
  return rawItems
    .map((item: any) => {
      if (item.product) {
        return {
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image_url: item.product.image_url ?? item.product.imageUrl ?? null,
          description: item.product.description ?? null,
          quantity: item.quantity,
        };
      }

      return {
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        image_url: item.image_url ?? null,
        description: item.description ?? null,
        quantity: item.quantity,
      };
    })
    .filter((item) => item.product_id && item.quantity);
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    console.log('Checkout success GET - userId:', userId, 'sessionId:', sessionId);

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Stripe session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // 2. Check if order already exists
    const { data: existingOrder } = await supabaseServer
      .from('orders')
      .select('id')
      .eq('stripe_session_id', sessionId)
      .single();

    if (existingOrder) {
      console.log('Order already exists for this session');
      return NextResponse.json({ success: true, orderId: existingOrder.id, alreadyExists: true });
    }

    const metadataItems = session.metadata ? safeParseItems(session.metadata.items) : [];
    const legacyMetadataItems = session.metadata ? safeParseItems(session.metadata.cartItems) : [];
    let items = normalizeItems(metadataItems.length ? metadataItems : legacyMetadataItems);
    const checkoutMode = session.metadata?.checkoutMode || 'cart';

    console.log('Stripe metadata items:', items);

    if ((!items || items.length === 0) && checkoutMode === 'cart') {
      const { data: cartItems, error: cartError } = await supabaseServer
        .from('cart_items')
        .select(`
          quantity,
          product:products (
            id,
            name,
            price,
            image_url,
            description
          )
        `)
        .eq('user_id', userId);

      console.log('Success fallback cart items:', cartItems);
      console.log('Success fallback cart error:', cartError);

      if (!cartError && cartItems?.length) {
        items = cartItems
          .filter((item: any) => item.product)
          .map((item: any) => ({
            product_id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url ?? null,
            description: item.product.description ?? null,
            quantity: item.quantity,
          }));
      }
    }

    if (!items || items.length === 0) {
      console.log('No checkout items found in metadata or fallback cart');
      return NextResponse.json({ success: true, message: 'No items found for order creation' });
    }

    const totalPrice = items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        total_price: totalPrice,
        status: 'paid',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('ORDER INSERT FAILED:', orderError);
      throw orderError;
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabaseServer
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('ORDER ITEMS INSERT FAILED:', orderItemsError);
      throw orderItemsError;
    }

    if (checkoutMode === 'cart') {
      const { error: clearCartError } = await supabaseServer
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (clearCartError) {
        console.error('Failed to clear cart (but order was created):', clearCartError);
      }
    }

    const customerName = session.metadata?.customerName || 'Valued Customer';

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalPrice,
      customerName
    });

  } catch (error) {
    console.error('Error processing successful checkout:', error);
    return NextResponse.json({
      error: 'Failed to process order',
      details: error instanceof Error ? error.message : error
    }, { status: 500 });
  }
}
