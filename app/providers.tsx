'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { SessionProvider } from "next-auth/react"
import { ReactNode } from 'react'

const queryClient = new QueryClient()

export function Providers({ children, session }: { children: ReactNode, session: Session | null }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}