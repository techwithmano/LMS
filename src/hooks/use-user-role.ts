"use client"

import { atom, useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import React from 'react'

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'OWNER'

// Atom to store the current user role
const userRoleAtom = atom<UserRole | null>(null)

export function useUserRole() {
  const { data: session } = useSession()
  const [role, setRole] = useAtom(userRoleAtom)

  // Update role when session changes
  React.useEffect(() => {
    if (session?.user?.role) {
      setRole(session.user.role as UserRole)
    }
  }, [session, setRole])

  return { role, setRole }
}
