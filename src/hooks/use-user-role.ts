"use client"

import { atom, useAtom } from 'jotai'

export type UserRole = 'owner' | 'admin' | 'student'

// Atom to store the current user role
const userRoleAtom = atom<UserRole>('student') // Default role

export function useUserRole() {
  const [role, setRole] = useAtom(userRoleAtom)
  return { role, setRole }
}
