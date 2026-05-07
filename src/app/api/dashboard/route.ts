import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    image_url?: string;
  };
  quantity: number;
}

interface RecentlyPurchasedItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  image_url?: string;
  quantity: number;
  orderDate: string;
  orderId: string;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all user orders with order items and product details
    const { data: orders, error: ordersError } = await supabaseServer
      .from('orders')
      .select(`
        id,
        stripe_session_id,
        total_price,
        status,
        created_at,
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (
            id,
            name,
            price,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Dashboard API orders error:', ordersError);
      return NextResponse.json(
        {
          error: 'Failed to fetch orders',
          details: ordersError.message
        },
        { status: 500 }
      );
    }

    // Fetch current cart items
    const { data: cartItems, error: cartError } = await supabaseServer
      .from('cart_items')
      .select('id, quantity, product:products(*)')
      .eq('user_id', userId);

    if (cartError) {
      console.error('Dashboard API cart error:', cartError);
    }

    const ordersList = orders || [];
    const userCartItems = cartItems || [];

    // Calculate total orders
    const totalOrders = ordersList.length;

    // Calculate total amount spent
    const totalSpent = ordersList.reduce(
      (sum, order) => sum + Number(order.total_price),
      0
    );

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Get latest order
    const latestOrder = ordersList[0] || null;

    let totalProductsPurchased = 0;
    const recentlyPurchased: RecentlyPurchasedItem[] = [];
    ordersList.forEach((order: any) => {
      const orderItems = order.order_items || [];
      orderItems.forEach((item: any) => {
        totalProductsPurchased += item.quantity;
        if (recentlyPurchased.length < 12 && item.products) {
          recentlyPurchased.push({
            id: item.products.id,
            name: item.products.name,
            price: item.price,
            imageUrl: item.products.image_url,
            quantity: item.quantity,
            orderDate: order.created_at,
            orderId: order.id,
          });
        }
      });
    });

    // Calculate cart total items
    const cartTotalItems = userCartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // Get last purchase date
    const lastPurchaseDate = latestOrder?.created_at || null;

    // Calculate monthly spending (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlySpending = ordersList
      .filter(order => new Date(order.created_at) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + Number(order.total_price), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalSpent,
        totalProductsPurchased,
        lastPurchaseDate,
        monthlySpending,
        averageOrderValue,
        cartTotalItems,
        latestOrder: latestOrder
          ? {
              id: latestOrder.id,
              total_price: latestOrder.total_price,
              status: latestOrder.status,
              created_at: latestOrder.created_at,
            }
          : null,
      },
      orders: ordersList.map((order: any) => ({
        id: order.id,
        stripe_session_id: order.stripe_session_id,
        total_price: order.total_price,
        status: order.status,
        order_items: order.order_items,
        created_at: order.created_at,
      })),
      cartItems: userCartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: item.product,
      })),
      recentlyPurchased,
    });
  } catch (error) {
    console.error('Dashboard API exception:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
