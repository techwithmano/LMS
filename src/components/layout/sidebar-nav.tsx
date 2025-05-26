"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUserRole, type UserRole } from "@/hooks/use-user-role"
import { navConfig, type NavItem } from "@/config/nav-config"
import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface SidebarNavProps {
  isCollapsed: boolean;
}

export function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const { role } = useUserRole();

  const filteredNavItems = navConfig.filter(item => item.roles.includes(role));

  if (!filteredNavItems.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {filteredNavItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <SidebarMenuItem key={index}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      variant="default"
                      size="default"
                      isActive={isActive}
                      className={cn(
                        "w-full justify-start",
                        isCollapsed && "justify-center"
                      )}
                      aria-label={item.title}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" align="center">
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
