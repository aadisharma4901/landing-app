import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * GET /api/admin/products – returns all products for the admin dashboard.
 * The middleware protects this route, ensuring only users with the admin role
 * can access it.
 */
export async function GET() {
  const { data, error } = await supabaseServer
    .from("products")
    .select("id, name, price, stock")
    .order("id", { ascending: true });

  if (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

