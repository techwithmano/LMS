"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { useUserProfile } from "@/hooks/useUserProfile";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage() {
  const { role } = useUserRole();
  const { profile } = useUserProfile();

  if (!role) return <div>Loading...</div>;
  if (role === "student") return <StudentDashboard userId={profile?.id || ""} />;
  if (role === "admin" || role === "owner") return <AdminDashboard />;

  return <div>Unknown role.</div>;
}
