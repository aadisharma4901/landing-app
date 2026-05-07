import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') as string;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    console.log('✅ Checkout session completed:', session.id, 'for user:', userId);

    if (!userId) {
      console.error('No userId found in session metadata');
      return NextResponse.json({ received: true });
    }

    try {
      // 1. Fetch cart items for user
      const { data: cartItems, error: cartError } = await supabaseServer
        .from('cart_items')
        .select(`
          id,
          quantity,
          product:products (
            id,
            name,
            price
          )
        `)
        .eq('user_id', userId);

      if (cartError) throw cartError;
      if (!cartItems || cartItems.length === 0) {
        console.log('No cart items found for user:', userId);
        return NextResponse.json({ received: true });
      }

       // 2. Calculate total price
       const totalPrice = cartItems.reduce((sum: number, item: any) => {
         return sum + (item.product.price * item.quantity);
       }, 0);

       // 3. Create order record
       const { data: order, error: orderError } = await supabaseServer
         .from('orders')
         .insert({
           user_id: userId,
           stripe_session_id: session.id,
           total_price: totalPrice,
           status: 'paid',
         })
         .select()
         .single();

       if (orderError) throw orderError;
       console.log('✅ Order created:', order);

       // 4. Store products as JSONB in the orders table
       const productsJsonb = cartItems.map((item: any) => ({
         product_id: item.product.id,
         name: item.product.name,
         price: item.product.price,
         image_url: item.product.image_url,
         description: item.product.description,
         quantity: item.quantity,
       }));

       const { error: updateError } = await supabaseServer
         .from('orders')
         .update({ products: productsJsonb })
         .eq('id', order.id);

       if (updateError) throw updateError;
       console.log('✅ Order products updated:', productsJsonb);

       // 5. Clear user's cart
       const { error: clearCartError } = await supabaseServer
         .from('cart_items')
         .delete()
         .eq('user_id', userId);

       if (clearCartError) throw clearCartError;
       console.log('✅ Cart cleared for user:', userId);

       console.log('✅ Order processing completed successfully!');

    } catch (error) {
      console.error('❌ Error processing order:', error);
      return NextResponse.json({ error: 'Order processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}