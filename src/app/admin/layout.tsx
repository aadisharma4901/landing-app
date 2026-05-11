"use client";

/**
 * Simple layout for all admin pages. It renders the admin‑only navigation bar
 * (`AdminNavbar`) and then displays the page content. The regular client
 * `Navbar` is hidden on any `/admin/*` route, so only this header is visible.
 * This avoids the duplicate header that appeared when the previous layout
 * wrapped the content with `DashboardShell` (which also includes its own
 * header).
 */
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-zinc-50 min-h-screen">{children}</div>
    </>
  );
}

