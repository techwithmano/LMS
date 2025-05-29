import type { UserRole } from '@/hooks/use-user-role';
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, BookOpen, ClipboardList, Megaphone, MessageSquare, UserCircle, Settings, Users } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

export const navConfig: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['owner', 'admin', 'student'],
  },
  {
    title: 'My Courses',
    href: '/courses',
    icon: BookOpen,
    roles: ['student'],
  },
  {
    title: 'Course Management',
    href: '/courses/manage', // Example admin route, actual page to be created if needed
    icon: BookOpen,
    roles: ['admin', 'owner'],
  },
  {
    title: 'Quizzes & Assignments',
    href: '/quizzes',
    icon: ClipboardList,
    roles: ['owner', 'admin', 'student'],
  },
  {
    title: 'Announcements',
    href: '/announcements',
    icon: Megaphone,
    roles: ['owner', 'admin', 'student'],
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    roles: ['owner', 'admin', 'student'],
  },
  {
    title: 'User Management',
    href: '/users/manage', // Example admin/owner route
    icon: Users,
    roles: ['admin', 'owner'],
  },
  {
    title: 'Site Settings',
    href: '/settings/site', // Example owner route
    icon: Settings,
    roles: ['owner'],
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: UserCircle,
    roles: ['owner', 'admin', 'student'],
  },
];
