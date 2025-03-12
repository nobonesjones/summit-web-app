'use client'

import { createClient } from '@/lib/supabase/client'
import { BusinessPlan, BusinessPlanInput, CompletedBusinessPlan } from '@/types/business-plan'
import { User } from '@supabase/supabase-js'
import { Database, Json } from '@/types/supabase'

type DbBusinessPlan = Database['public']['Tables']['business_plans']['Row']
type DbBusinessPlanInsert = Database['public']['Tables']['business_plans']['Insert']
type DbBusinessPlanUpdate = Database['public']['Tables']['business_plans']['Update']

// Custom error class for business plan operations
export class BusinessPlanError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'BusinessPlanError'
  }
}

// Error codes for different scenarios
export const BusinessPlanErrorCodes = {
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  CREATION_FAILED: 'CREATION_FAILED',
  FETCH_FAILED: 'FETCH_FAILED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const

// Helper function to get the current user
async function getCurrentUser(): Promise<User> {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('Authentication error:', error)
    throw new BusinessPlanError(
      'User must be authenticated to perform this action',
      BusinessPlanErrorCodes.NOT_AUTHENTICATED,
      error
    )
  }

  return user
}

// Convert database business plan to our application type
function convertToCompletedBusinessPlan(dbPlan: DbBusinessPlan): CompletedBusinessPlan {
  // Parse JSON strings into objects if needed
  const sections = typeof dbPlan.sections === 'string' 
    ? JSON.parse(dbPlan.sections) 
    : dbPlan.sections

  const details = typeof dbPlan.details === 'string'
    ? JSON.parse(dbPlan.details)
    : dbPlan.details

  const metadata = typeof dbPlan.metadata === 'string'
    ? JSON.parse(dbPlan.metadata)
    : dbPlan.metadata

  return {
    id: dbPlan.id,
    user_id: dbPlan.user_id,
    title: dbPlan.title,
    business_idea: dbPlan.business_idea,
    location: dbPlan.location,
    category: dbPlan.category,
    sections: sections as CompletedBusinessPlan['sections'],
    details: details as CompletedBusinessPlan['details'],
    metadata: metadata as CompletedBusinessPlan['metadata'],
    status: dbPlan.status as CompletedBusinessPlan['status'],
    version: dbPlan.version,
    is_public: dbPlan.is_public,
    tags: dbPlan.tags,
    created_at: dbPlan.created_at,
    updated_at: dbPlan.updated_at
  }
}

// Convert our application type to database type
function convertToDbBusinessPlan(plan: BusinessPlanInput): DbBusinessPlanInsert {
  // Format the title as "[business idea], [location]"
  const formattedTitle = plan.title || `${plan.business_idea}, ${plan.location}`;
  
  // Only use the title field, not name
  const dbPlan: any = {
    user_id: '', // Will be set in createBusinessPlan
    title: formattedTitle, // Format as "[business idea], [location]"
    business_idea: plan.business_idea,
    location: plan.location,
    category: plan.category,
    sections: plan.sections as unknown as Json,
    details: plan.details as unknown as Json,
    metadata: plan.metadata as unknown as Json,
    status: plan.status || 'draft',
    version: plan.version || 1,
    is_public: plan.is_public || false,
    tags: plan.tags || [],
    updated_at: new Date().toISOString()
  };
  
  return dbPlan;
}

// Validate business plan data before creation
function validateBusinessPlan(plan: BusinessPlanInput): void {
  const requiredFields = ['title', 'business_idea', 'location', 'category']
  const missingFields = requiredFields.filter(field => !plan[field as keyof BusinessPlanInput])

  if (missingFields.length > 0) {
    throw new BusinessPlanError(
      `Missing required fields: ${missingFields.join(', ')}`,
      BusinessPlanErrorCodes.VALIDATION_FAILED
    )
  }
}

/**
 * Creates a new business plan for the authenticated user
 * @param planData The business plan data to create
 * @returns The created business plan
 * @throws BusinessPlanError if creation fails
 */
export async function createBusinessPlan(planData: BusinessPlanInput): Promise<CompletedBusinessPlan> {
  console.log('Starting business plan creation process...')
  console.log('Plan data:', JSON.stringify(planData, null, 2))
  const supabase = createClient()

  try {
    // Get current user
    const user = await getCurrentUser()
    console.log('User authenticated:', user.id)

    // Validate plan data
    validateBusinessPlan(planData)
    console.log('Business plan data validated')

    // Prepare plan data with user_id
    const dbPlan = convertToDbBusinessPlan(planData)
    dbPlan.user_id = user.id
    console.log('Prepared database plan:', JSON.stringify(dbPlan, null, 2))

    console.log('Inserting business plan into database...')
    const { data: createdPlan, error } = await supabase
      .from('business_plans')
      .insert(dbPlan)
      .select('*')
      .single()

    if (error) {
      console.error('Database error during business plan creation:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // Provide more specific error messages based on error code
      let errorMessage = 'Failed to create business plan';
      let errorCode = 'DATABASE_ERROR';
      
      if (error.code === '23502') {
        errorMessage = 'Missing required fields in business plan';
        errorCode = 'VALIDATION_FAILED';
      } else if (error.code === '23503') {
        errorMessage = 'User ID not found or invalid';
        errorCode = 'NOT_AUTHENTICATED';
      } else if (error.code === '42703') {
        errorMessage = 'Database schema mismatch - column not found';
        errorCode = 'DATABASE_ERROR';
      }
      
      throw new BusinessPlanError(
        errorMessage,
        errorCode,
        error
      )
    }

    if (!createdPlan) {
      throw new BusinessPlanError(
        'Business plan creation failed - no data returned',
        BusinessPlanErrorCodes.CREATION_FAILED
      )
    }

    console.log('Business plan created successfully:', createdPlan.id)
    return convertToCompletedBusinessPlan(createdPlan)
  } catch (error) {
    if (error instanceof BusinessPlanError) {
      throw error
    }

    console.error('Unexpected error during business plan creation:', error)
    
    // Log more details if it's an Error object
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    throw new BusinessPlanError(
      'An unexpected error occurred while creating the business plan',
      BusinessPlanErrorCodes.CREATION_FAILED,
      error
    )
  }
}

/**
 * Fetches all business plans for the authenticated user
 * @param options Optional parameters for filtering and sorting
 * @returns Array of business plans
 * @throws BusinessPlanError if fetch fails
 */
export async function getUserBusinessPlans(options: {
  status?: 'draft' | 'completed' | 'archived'
  limit?: number
  orderBy?: 'created_at' | 'updated_at' | 'title'
  orderDirection?: 'asc' | 'desc'
} = {}): Promise<CompletedBusinessPlan[]> {
  console.log('Fetching user business plans...')
  const supabase = createClient()

  try {
    // Get current user
    const user = await getCurrentUser()
    console.log('User authenticated:', user.id)

    // Build query
    let query = supabase
      .from('business_plans')
      .select('*')
      .eq('user_id', user.id)

    // Apply filters
    if (options.status) {
      query = query.eq('status', options.status)
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(
        options.orderBy,
        { ascending: options.orderDirection !== 'desc' }
      )
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit)
    }

    console.log('Executing database query...')
    const { data: plans, error } = await query

    if (error) {
      console.error('Database error while fetching business plans:', error)
      throw new BusinessPlanError(
        'Failed to fetch business plans',
        BusinessPlanErrorCodes.DATABASE_ERROR,
        error
      )
    }

    if (!plans) {
      console.log('No business plans found for user')
      return []
    }

    console.log(`Successfully fetched ${plans.length} business plans`)
    return plans.map(plan => convertToCompletedBusinessPlan(plan))
  } catch (error) {
    if (error instanceof BusinessPlanError) {
      throw error
    }

    console.error('Unexpected error while fetching business plans:', error)
    throw new BusinessPlanError(
      'An unexpected error occurred while fetching business plans',
      BusinessPlanErrorCodes.FETCH_FAILED,
      error
    )
  }
}

/**
 * Updates an existing business plan
 * @param planId The ID of the plan to update
 * @param updateData The data to update
 * @returns The updated business plan
 * @throws BusinessPlanError if update fails
 */
export async function updateBusinessPlan(
  planId: string,
  updateData: Partial<BusinessPlanInput>
): Promise<CompletedBusinessPlan> {
  console.log(`Starting business plan update process for plan ${planId}...`)
  const supabase = createClient()

  try {
    const user = await getCurrentUser()
    console.log('User authenticated:', user.id)

    const dbUpdateData: DbBusinessPlanUpdate = {
      title: updateData.title,
      business_idea: updateData.business_idea,
      location: updateData.location,
      category: updateData.category,
      sections: updateData.sections as unknown as Json,
      details: updateData.details as unknown as Json,
      metadata: updateData.metadata as unknown as Json,
      status: updateData.status,
      version: updateData.version,
      is_public: updateData.is_public,
      tags: updateData.tags,
      updated_at: new Date().toISOString()
    }

    console.log('Updating business plan in database...')
    const { data: updatedPlan, error } = await supabase
      .from('business_plans')
      .update(dbUpdateData)
      .eq('id', planId)
      .eq('user_id', user.id) // Ensure user owns the plan
      .select('*')
      .single()

    if (error) {
      console.error('Database error during business plan update:', error)
      throw new BusinessPlanError(
        'Failed to update business plan',
        BusinessPlanErrorCodes.DATABASE_ERROR,
        error
      )
    }

    if (!updatedPlan) {
      throw new BusinessPlanError(
        'Business plan update failed - no data returned',
        BusinessPlanErrorCodes.DATABASE_ERROR
      )
    }

    console.log('Business plan updated successfully:', updatedPlan.id)
    return convertToCompletedBusinessPlan(updatedPlan)
  } catch (error) {
    if (error instanceof BusinessPlanError) {
      throw error
    }

    console.error('Unexpected error during business plan update:', error)
    throw new BusinessPlanError(
      'An unexpected error occurred while updating the business plan',
      BusinessPlanErrorCodes.DATABASE_ERROR,
      error
    )
  }
} 