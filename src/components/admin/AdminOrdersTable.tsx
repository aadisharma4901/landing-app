"use client";

export interface AdminOrder {
  id: number;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminOrdersTable({
  orders,
}: {
  orders: AdminOrder[];
}) {
  return (
    <table className="min-w-full bg-white border">
      <thead className="bg-zinc-100">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">User ID</th>
          <th className="p-2 text-left">Total</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Created</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="border-t">
            <td className="p-2">{o.id}</td>
            <td className="p-2">{o.user_id}</td>
            <td className="p-2">${o.total_price}</td>
            <td className="p-2">{o.status}</td>
            <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

