import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return unauthorized();
  }

  const baseCartQuery = `
    id,
    quantity,
    product:products (*)
  `;

  const cartWithUserQuery = `
    ${baseCartQuery},
    user:users (
      first_name,
      last_name,
      email,
      image_url
    )
  `;

  const { data, error } = await supabaseServer
    .from('cart_items')
    .select(cartWithUserQuery)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart items with users join, retrying without users:', error);

    const { data: fallbackData, error: fallbackError } = await supabaseServer
      .from('cart_items')
      .select(baseCartQuery)
      .eq('user_id', userId);

    if (fallbackError) {
      console.error('Error fetching cart items:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to fetch cart', details: fallbackError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: fallbackData ?? [] });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return unauthorized();
  }

  const body = await request.json();
  const productId = Number(body.productId);
  const quantityToAdd = Math.max(1, Number(body.quantity) || 1);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabaseServer
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existingError && existingError.code !== 'PGRST116') {
    console.error('Error checking existing cart item:', existingError);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }

  if (existing) {
    const nextQuantity = existing.quantity + quantityToAdd;

    const { error: updateError } = await supabaseServer
      .from('cart_items')
      .update({ quantity: nextQuantity })
      .eq('id', existing.id)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating cart item quantity:', updateError);
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

    return NextResponse.json({ id: existing.id, productId, quantity: nextQuantity });
  }

  const { data: insertedItem, error: insertError } = await supabaseServer
    .from('cart_items')
    .insert({
      user_id: userId,
      product_id: productId,
      quantity: quantityToAdd,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error inserting cart item:', insertError);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }

  return NextResponse.json({ id: insertedItem.id, productId, quantity: quantityToAdd });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return unauthorized();
  }

  const body = await request.json();
  const productId = Number(body.productId);
  const quantity = Number(body.quantity);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
  }

  if (!Number.isInteger(quantity)) {
    return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
  }

  if (quantity <= 0) {
    const { error: deleteError } = await supabaseServer
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (deleteError) {
      console.error('Error deleting cart item:', deleteError);
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }

    return NextResponse.json({ productId, quantity: 0 });
  }

  const { error: updateError } = await supabaseServer
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (updateError) {
    console.error('Error updating cart item:', updateError);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }

  return NextResponse.json({ productId, quantity });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return unauthorized();
  }

  const body = await request.json().catch(() => ({}));
  const cartItemId =
    typeof body.cartItemId === 'string' && body.cartItemId.trim() !== ''
      ? body.cartItemId
      : null;

  if (cartItemId !== null) {
    console.log('DELETE cartItemId:', cartItemId);

    const { data, error } = await supabaseServer
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .select();

    console.log('DELETE response:', { data, error });

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: data?.length ?? 0,
    });
  }

  const { data, error } = await supabaseServer
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .select();

   if (error) {
     console.error('Error deleting cart items:', error);
     return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
   }

   return NextResponse.json({
     success: true,
     deletedCount: data?.length ?? 0,
   });
}
