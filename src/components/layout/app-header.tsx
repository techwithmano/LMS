"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/layout/user-nav"
import { useUserRole } from "@/hooks/use-user-role"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import Link from "next/link"


const BreadcrumbNav = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          if (segment === "dashboard" && index === 0) return null; // Already handled
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};


export function AppHeader() {
  const { role } = useUserRole(); // For displaying current role if needed

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="hidden sm:block">
        <BreadcrumbNav />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden md:inline">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</span>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}
