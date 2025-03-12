'use client';

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import type { BusinessPlan, CreateBusinessPlanInput } from '@/types/business-plan'
import { toast } from 'sonner'
import { BusinessPlanError } from '@/lib/supabase/services/businessPlans'

const supabase = createClient()

export type BusinessPlansHookOptions = {
  status?: 'draft' | 'completed' | 'archived'
  limit?: number
  orderBy?: 'created_at' | 'updated_at' | 'title'
  orderDirection?: 'asc' | 'desc'
  autoFetch?: boolean
}

export type BusinessPlansHookReturn = {
  businessPlans: BusinessPlan[]
  isLoading: boolean
  error: Error | null
  createPlan: (input: CreateBusinessPlanInput) => Promise<BusinessPlan | null>
  refreshBusinessPlans: () => void
  isRefreshing: boolean
  fetchBusinessPlans: () => Promise<void>
}

export function useBusinessPlans(options: BusinessPlansHookOptions = {}): BusinessPlansHookReturn {
  const { user } = useAuth()
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Wrap fetchBusinessPlans in useCallback to prevent recreation on every render
  const fetchBusinessPlans = useCallback(async () => {
    if (!user) {
      console.log('No user found, clearing business plans')
      setBusinessPlans([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log('Fetching business plans for user:', user.id)
      
      // Add a small delay to ensure the user ID is properly set
      // This helps prevent race conditions with authentication
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('user_id', user.id)
        .order(options.orderBy || 'created_at', { 
          ascending: options.orderDirection === 'asc' 
        })
        .limit(options.limit || 50)

      if (error) {
        console.error('Supabase error fetching business plans:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      // Log the result for debugging
      console.log('Business plans fetch result:', { 
        userId: user.id,
        count: data?.length || 0,
        plans: data
      })
      
      // Empty array is a valid result (user has no plans yet)
      setBusinessPlans(data || [])
    } catch (err) {
      console.error('Error fetching business plans:', err)
      setError(err instanceof Error ? err : new Error('Error in business plans fetch'))
      
      // Show error toast with more specific message
      if (err instanceof BusinessPlanError) {
        toast.error(`Failed to fetch business plans: ${err.message}`)
      } else if (err instanceof Error) {
        toast.error(`Error loading business plans: ${err.message}`)
      } else {
        toast.error('An unexpected error occurred while fetching business plans')
      }
    } finally {
      setIsLoading(false)
    }
  }, [user, options.orderBy, options.orderDirection, options.limit]);

  // Refresh function that uses the memoized fetchBusinessPlans
  const refreshBusinessPlans = useCallback(() => {
    setIsRefreshing(true)
    fetchBusinessPlans()
      .finally(() => setIsRefreshing(false))
  }, [fetchBusinessPlans]);

  // Use the memoized functions in useEffect
  useEffect(() => {
    if (!user || options.autoFetch === false) {
      setIsLoading(false)
      setBusinessPlans([])
      return
    }

    fetchBusinessPlans()
  }, [user, fetchBusinessPlans, options.autoFetch])

  async function createPlan(input: CreateBusinessPlanInput): Promise<BusinessPlan | null> {
    if (!user) throw new Error('Must be logged in to create a business plan')

    try {
      const { data, error } = await supabase
        .from('business_plans')
        .insert([{
          ...input,
          user_id: user.id
        }])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      if (data) {
        setBusinessPlans(prevPlans => [data, ...prevPlans])
      }
      
      // Show success toast
      toast.success('Business plan created successfully')
      
      return data
    } catch (err) {
      console.error('Error creating business plan:', err)
      
      // Show error toast
      if (err instanceof BusinessPlanError) {
        toast.error(`Failed to create business plan: ${err.message}`)
      } else {
        toast.error('An unexpected error occurred while creating the business plan')
      }
      
      throw err instanceof Error ? err : new Error('Failed to create business plan')
    }
  }

  return {
    businessPlans,
    isLoading,
    error,
    createPlan,
    refreshBusinessPlans,
    isRefreshing,
    fetchBusinessPlans
  }
}

// Example usage:
/*
function BusinessPlansList() {
  const {
    businessPlans,
    isLoading,
    error,
    createPlan,
    refreshBusinessPlans,
    isRefreshing
  } = useBusinessPlans({
    status: 'draft',
    orderBy: 'created_at',
    orderDirection: 'desc'
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <button 
        onClick={() => refreshBusinessPlans()}
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
      
      {businessPlans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.title}</h3>
          <p>{plan.business_idea}</p>
        </div>
      ))}
    </div>
  )
}
*/ 