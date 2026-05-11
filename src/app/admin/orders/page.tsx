"use client";

/**
 * Admin Orders page – displays a table of all orders.
 * Data is fetched from `/api/admin/orders`.
 */
import { useEffect, useState } from "react";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // The admin layout (navbar) is applied automatically via `src/app/admin/layout.tsx`.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
      {loading ? (
        <p>Loading orders…</p>
      ) : (
        <AdminOrdersTable orders={orders} />
      )}
    </div>
  );
}
