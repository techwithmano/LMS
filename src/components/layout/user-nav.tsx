"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserRole, type UserRole } from "@/hooks/use-user-role"
import { User, LogOut, Settings, Users, Shield } from "lucide-react"
import Link from "next/link"

function RoleSwitcher() {
  const { role, setRole } = useUserRole();
  const roles: UserRole[] = ['student', 'admin', 'owner'];

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
      {roles.map((r) => (
        <DropdownMenuItem key={r} onClick={() => setRole(r)} disabled={role === r}>
          {r.charAt(0).toUpperCase() + r.slice(1)}
          {role === r && <DropdownMenuShortcut>✓</DropdownMenuShortcut>}
        </DropdownMenuItem>
      ))}
    </DropdownMenuGroup>
  );
}


export function UserNav() {
  const { role } = useUserRole();

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length > 1) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0].substring(0, 2);
  };
  
  const userName = `${role.charAt(0).toUpperCase() + role.slice(1)} User`;
  const userEmail = `${role}@example.com`;


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(userName)}`} alt={userName} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          {(role === 'admin' || role === 'owner') && (
            <Link href="/users/manage" passHref>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </DropdownMenuItem>
            </Link>
          )}
          {role === 'owner' && (
             <Link href="/settings/site" passHref>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Site Settings</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <RoleSwitcher />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
