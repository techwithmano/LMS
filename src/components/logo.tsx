import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 p-2">
      <GraduationCap className="h-8 w-8 text-primary" />
      {!collapsed && <span className="text-xl font-bold text-foreground">Techwithmano LMS</span>}
    </Link>
  );
}
