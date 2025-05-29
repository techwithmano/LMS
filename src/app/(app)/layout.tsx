"use client"

import * as React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { AppHeader } from "@/components/layout/app-header"

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { state: sidebarState } = useSidebar(); // Get sidebar state
  const isCollapsed = sidebarState === "collapsed";

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Logo collapsed={isCollapsed} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav isCollapsed={isCollapsed} />
        </SidebarContent>
        <SidebarFooter>
          {/* Optional: User info or quick actions */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
