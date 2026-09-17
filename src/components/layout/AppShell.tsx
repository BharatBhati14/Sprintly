"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNavigation } from "./MobileNavigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <MobileNavigation
        open={mobileNavigationOpen}
        onClose={() => setMobileNavigationOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileNavigationOpen(true)} />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
