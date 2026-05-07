import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { paymentIntentId, customerDetails } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing payment intent ID' }, { status: 400 });
    }

    // Retrieve the payment intent to verify it succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Check if order already exists
    const { data: existingOrder } = await supabaseServer
      .from('orders')
      .select('id')
      .eq('stripe_session_id', paymentIntentId)
      .single();

    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder.id, alreadyExists: true });
    }

    // Parse items from metadata
    const items = paymentIntent.metadata?.items ? JSON.parse(paymentIntent.metadata.items) : [];

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items found in payment' }, { status: 400 });
    }

    const totalPrice = items.reduce((sum: number, item: any) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    const customerName = paymentIntent.metadata?.customerName || customerDetails?.fullName || 'Valued Customer';

    // Create order - use only columns that exist in the orders table
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        user_id: userId,
        stripe_session_id: paymentIntentId,
        total_price: totalPrice,
        status: 'paid',
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      throw orderError;
    }

    // Try to store products as JSONB (if products column exists)
    // If it fails, that's okay - the order is still saved
    const { error: updateError } = await supabaseServer
      .from('orders')
      .update({ products: items })
      .eq('id', order.id);

    if (updateError) {
      console.log('Note: products column not available, order saved without product data');
    }

    // Clear the cart
    const { error: clearCartError } = await supabaseServer
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (clearCartError) {
      console.error('Failed to clear cart:', clearCartError);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalPrice,
      customerName,
    });
  } catch (error: any) {
    console.error('Confirm order error:', error?.message);
    return NextResponse.json({ error: error?.message || 'Failed to confirm order' }, { status: 500 });
  }
}