import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
        <MobileHeader />
        <main className="flex-1">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}

