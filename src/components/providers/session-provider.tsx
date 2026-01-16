'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const SessionProvider = NextAuthSessionProvider as unknown as React.ComponentType<{
    children: React.ReactNode
  }>
  return <SessionProvider>{children}</SessionProvider>
}
