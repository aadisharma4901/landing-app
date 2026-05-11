import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * GET /api/admin/orders – returns all orders for the admin dashboard.
 * No user filter – the middleware ensures only admins can call this.
 */
export async function GET() {
  const { data, error } = await supabaseServer
    .from("orders")
    .select("id, user_id, total_price, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

