"use client";

/**
 * Admin Users page – displays a table of all users.
 * Data is fetched from `/api/admin/users`.
 */
import { useEffect, useState } from "react";
import AdminUsersTable from "@/components/admin/AdminUsersTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // The admin layout is applied automatically via `src/app/admin/layout.tsx`.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      {loading ? (
        <p>Loading users…</p>
      ) : (
        <AdminUsersTable users={users} />
      )}
    </div>
  );
}
