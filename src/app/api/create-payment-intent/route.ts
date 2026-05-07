import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { cartItems, customerDetails } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Fetch product details
    const productIds = cartItems.map((i: any) => i.productId);
    const { data: products, error: productsError } = await supabaseServer
      .from('products')
      .select('id, name, price, description')
      .in('id', productIds);

    if (productsError) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const productMap = new Map(products?.map(p => [p.id, p]) || []);
    let totalAmount = 0;
    const itemsMetadata: any[] = [];

    for (const item of cartItems) {
      const product = productMap.get(Number(item.productId));
      if (product) {
        const itemTotal = Math.round(product.price * Number(item.quantity) * 100);
        totalAmount += itemTotal;
        itemsMetadata.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });
      }
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid cart total' }, { status: 400 });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        userId,
        customerName: customerDetails?.fullName || '',
        customerEmail: customerDetails?.email || 'testing@gmail.com',
        customerPhone: customerDetails?.phone || '',
        customerAddress: `${customerDetails?.address || ''}, ${customerDetails?.city || ''}, ${customerDetails?.state || ''} ${customerDetails?.zip || ''}`,
        items: JSON.stringify(itemsMetadata),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error?.message);
    return NextResponse.json({ error: error?.message || 'Failed to create payment' }, { status: 500 });
  }
}