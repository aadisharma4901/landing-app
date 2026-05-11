'use client';

import { ReactNode, useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardShellProps {
  children: ReactNode;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    imageUrl: string | null;
  } | null;
  activeSection?: string;
}

export default function DashboardShell({ children, user, activeSection = 'overview', hideSidebar = false }: DashboardShellProps & { hideSidebar?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
       {/* Sidebar */}
       {!hideSidebar && (
         <div className="hidden lg:block">
           <DashboardSidebar />
         </div>
       )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <DashboardHeader
          user={user}
          activeSection={activeSection}
          onMenuToggle={handleMenuToggle}
        />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
