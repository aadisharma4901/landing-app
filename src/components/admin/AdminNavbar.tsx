"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

/**
 * Simple navigation bar used only for the admin area. It provides links to the
 * main admin sections (Products, Orders, Users) and a sign‑out button.
 * The regular client‑side `Navbar` is hidden on any `/admin/*` route, so the
 * admin UI gets its own distinct header.
 */
export default function AdminNavbar() {
  const pathname = usePathname();
  // Clerk hook must be called at the top level of the component.
  const { signOut } = useClerk();

  const navItems = [
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
  ];

  return (
    <nav className="bg-indigo-800 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/admin" className="text-xl font-bold">
          Admin Panel
        </Link>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:underline ${pathname === item.href ? "underline" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        {/* Use Clerk's signOut method to properly clear the session and redirect */}
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}
