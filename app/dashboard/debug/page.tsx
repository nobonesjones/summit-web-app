'use client'

import { BusinessPlanDebugger } from '@/components/BusinessPlanDebugger'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/components/providers/auth-provider'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DebugPage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Set mounted to true when component mounts
  useEffect(() => {
    setMounted(true);
    console.log('Debug page mounted, auth state:', user ? 'Authenticated' : 'Not authenticated');
  }, [user]);

  // Don't render anything on the server to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-md mb-8" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Business Plan Debug Console</h1>
          <p className="text-muted-foreground mt-2">
            Test and debug business plan creation, retrieval, and management functionality.
          </p>
          {user && (
            <p className="text-sm text-green-600 mt-2">
              Signed in as: {user.email}
            </p>
          )}
        </div>

        <BusinessPlanDebugger />
      </div>
    </ProtectedRoute>
  )
} 