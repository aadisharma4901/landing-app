import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Orders API error:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch orders',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
    });
  } catch (error) {
    console.error('Orders API exception:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
