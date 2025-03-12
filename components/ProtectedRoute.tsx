'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect after auth has been checked and user is not authenticated
    if (!isLoading && !isSignedIn) {
      console.log('[ProtectedRoute] User not authenticated, redirecting to sign-in')
      router.push('/sign-in')
    }
  }, [isSignedIn, isLoading, router])

  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Only render children if user is authenticated
  return isSignedIn ? <>{children}</> : null
} 