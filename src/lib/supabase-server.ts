import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase server environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.'
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseKey);

/**
 * Helper functions for admin‑only data access. These are used by the admin API
 * routes (`/api/admin/*`). The middleware already restricts access to users
 * with the admin role, so the functions can assume the caller is authorized.
 */

export const adminQueries = {
  /** Fetch all products (id, name, price, stock). */
  async getAllProducts() {
    const { data, error } = await supabaseServer
      .from("products")
      .select("id, name, price, stock")
      .order("id", { ascending: true });
    if (error) throw error;
    return data;
  },

  /** Fetch all orders with basic fields. */
  async getAllOrders() {
    const { data, error } = await supabaseServer
      .from("orders")
      .select("id, user_id, total_price, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  /** Fetch all users (id, email, role). */
  async getAllUsers() {
    const { data, error } = await supabaseServer
      .from("users")
      .select("id, email, role")
      .order("id", { ascending: true });
    if (error) throw error;
    return data;
  },
  /** Fetch top 5 best‑selling products (by total quantity sold). */
  async getTopProducts() {
    // Assumes an `order_items` table with `product_id` and `quantity` columns.
    const { data, error } = await supabaseServer
      .from('order_items')
      .select('product_id, quantity');
    if (error) throw error;
    const qtyMap = new Map<number, number>();
    data?.forEach((item: any) => {
      const prev = qtyMap.get(item.product_id) ?? 0;
      qtyMap.set(item.product_id, prev + item.quantity);
    });
    const top = Array.from(qtyMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([product_id, total]) => ({ product_id, total }));
    return top;
  },
  /** Fetch top 5 users by total order value. */
  async getTopUsers() {
    const { data, error } = await supabaseServer
      .from('orders')
      .select('user_id, total_price');
    if (error) throw error;
    const spendMap = new Map<string, number>();
    data?.forEach((order: any) => {
      const prev = spendMap.get(order.user_id) ?? 0;
      spendMap.set(order.user_id, prev + order.total_price);
    });
    const top = Array.from(spendMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([user_id, total_spent]) => ({ user_id, total_spent }));
    return top;
  },
};
