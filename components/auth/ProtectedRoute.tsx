'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * A component that protects routes by requiring authentication
 * Redirects to sign-in page if user is not authenticated
 */
export function ProtectedRoute({ 
  children, 
  redirectTo = '/sign-in' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check authentication and redirect if needed
  useEffect(() => {
    // Only run this effect on the client side and when auth is not loading
    if (isClient && !loading) {
      console.log('ProtectedRoute: Auth state -', user ? 'Authenticated' : 'Not authenticated')
      
      if (!user) {
        console.log('ProtectedRoute: Redirecting to', redirectTo)
        router.push(redirectTo)
      }
    }
  }, [user, loading, router, redirectTo, isClient])

  // Don't render anything on the server to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col space-y-3 p-8">
        <Skeleton className="h-8 w-full max-w-sm" />
        <Skeleton className="h-8 w-full max-w-md" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    )
  }

  // If authenticated, render children
  if (user) {
    return <>{children}</>
  }

  // Otherwise, render nothing (will redirect)
  return null
} 