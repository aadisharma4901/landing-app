"use client";

/**
 * Admin Products page – displays a simple table of all products.
 * The data is fetched from the `/api/admin/products` endpoint which
 * returns the full list of products from Supabase. The page is wrapped
 * in the shared `AdminLayout` (defined in `src/app/admin/layout.tsx`).
 */
import { useEffect, useState } from "react";
import AdminLayout from "@/app/admin/layout";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products Management</h1>
        {loading ? (
          <p>Loading products…</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead className="bg-zinc-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

