import type { ReactNode } from "react";

import { MobileNav } from "./mobile-nav";
import { PlayerBar } from "./player-bar";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <div className="lg:pl-70">
        <Topbar />
        <main className="min-h-[calc(100vh-4rem)] pb-36">{children}</main>
      </div>
      <PlayerBar />
      <MobileNav />
    </div>
  );
}
