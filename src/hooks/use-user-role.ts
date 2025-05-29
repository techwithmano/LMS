"use client"

import { useUserProfile } from './useUserProfile';

export function useUserRole() {
  const { profile, loading } = useUserProfile();
  return { role: profile?.role ?? 'student', loading };
}
