import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * GET /api/admin/users – returns a list of all users for the admin dashboard.
 * The middleware ensures only admins can call this endpoint.
 */
export async function GET() {
  const { data, error } = await supabaseServer
    .from("users")
    .select("id, email, role")
    .order("id", { ascending: true });

  if (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

