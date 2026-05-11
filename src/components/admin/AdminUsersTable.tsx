"use client";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export default function AdminUsersTable({
  users,
}: {
  users: AdminUser[];
}) {
  return (
    <table className="min-w-full bg-white border">
      <thead className="bg-zinc-100">
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Email</th>
          <th className="p-2 text-left">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-t">
            <td className="p-2">{u.id}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

