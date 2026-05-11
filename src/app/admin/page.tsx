"use client";

/**
 * Admin landing page – displays the products table as the main view.
 * It fetches product data from the admin API (`/api/admin/products`) and
 * renders a single table using `AdminProductTable`. The layout (`src/app/admin/layout.tsx`)
 * already provides the admin sidebar and top navigation, and the client `Navbar`
 * is hidden on any `/admin/*` route.
 */
import { useEffect, useState } from "react";
import AdminProductTable, { AdminProduct } from "@/components/admin/AdminProductTable";

export default function AdminHome() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // The folder layout (`src/app/admin/layout.tsx`) already provides the admin
  // navigation bar and surrounding padding, so we render only the page‑specific
  // content here.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Products</h1>
      {loading ? (
        <p>Loading products…</p>
      ) : (
        <AdminProductTable products={products} />
      )}
    </div>
  );
}
