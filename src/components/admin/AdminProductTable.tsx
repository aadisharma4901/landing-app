"use client";

/**
 * Reusable table component for displaying a list of products in the admin UI.
 * It receives an array of product objects and renders a simple HTML table.
 */
export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  stock: string;
}

export default function AdminProductTable({
  products,
}: {
  products: AdminProduct[];
}) {
  return (
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
  );
}

