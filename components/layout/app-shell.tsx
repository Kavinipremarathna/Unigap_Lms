"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardTopNav } from "@/components/layout/dashboard-top-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load saved sidebar preference
  useEffect(() => {
    const saved = localStorage.getItem("unigap-sidebar-collapsed");
    if (saved !== null) {
      setIsSidebarCollapsed(saved === "true");
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("unigap-sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-bg transition-colors">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <MobileHeader />
        <div className="hidden lg:block">
          <DashboardTopNav
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />
        </div>
        <main className="flex-1">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}


