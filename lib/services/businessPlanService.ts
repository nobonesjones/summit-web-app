/**
 * Business Plan Service
 * 
 * This file contains functions for storing and retrieving business plans.
 */

import { v4 as uuidv4 } from 'uuid';
import { useCallback, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { BusinessPlan as DbBusinessPlan } from '@/types/businessPlan';
import { createBusinessPlan as createSupabaseBusinessPlan } from '@/lib/supabase/services/businessPlans';

// Local storage key for business plans
const BUSINESS_PLANS_STORAGE_KEY = 'summit_business_plans';

// Define the BusinessPlanSection interface
export interface BusinessPlanSection {
  title: string;
  content: string;
}

export interface BusinessPlan {
  id?: string;
  title: string;
  business_idea: string;
  location: string;
  category: string;
  sections: BusinessPlanSection[];
  created_at?: string;
}

/**
 * Standalone function to save a business plan to Supabase
 */
export async function saveBusinessPlan(businessPlan: BusinessPlan): Promise<BusinessPlan> {
  console.log('Saving business plan to Supabase:', businessPlan);
  
  try {
    const supabase = createClient();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User must be authenticated to save a business plan');
    }
    
    // Enhanced validation for required fields
    const requiredFields = ['title', 'business_idea', 'location', 'category'];
    const missingFields = requiredFields.filter(field => !businessPlan[field as keyof BusinessPlan]);
    
    if (missingFields.length > 0) {
      console.error(`Missing required fields for Supabase save: ${missingFields.join(', ')}`, businessPlan);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Try to save to Supabase with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    let savedPlan = null;
    let lastError = null;
    
    while (retryCount < maxRetries && !savedPlan) {
      try {
        // Convert the business plan to the format expected by Supabase
        const supabaseBusinessPlan = {
          title: businessPlan.title || 'Untitled Business Plan',
          business_idea: businessPlan.business_idea,
          location: businessPlan.location,
          category: businessPlan.category || 'New Company',
          sections: Array.isArray(businessPlan.sections) ? businessPlan.sections : []
        };
        
        console.log(`Attempt ${retryCount + 1}/${maxRetries} to save business plan:`, supabaseBusinessPlan);
        
        // Save to Supabase
        savedPlan = await createSupabaseBusinessPlan(supabaseBusinessPlan);
        
        if (!savedPlan) {
          throw new Error('Failed to save to Supabase - no data returned');
        }
        
        console.log('Successfully saved business plan to Supabase:', savedPlan);
        
        // Convert the saved plan back to our BusinessPlan type
        const convertedPlan: BusinessPlan = {
          id: savedPlan.id,
          title: savedPlan.title,
          business_idea: savedPlan.business_idea,
          location: savedPlan.location,
          category: savedPlan.category,
          sections: Array.isArray(savedPlan.sections) ? savedPlan.sections : [],
          created_at: savedPlan.created_at
        };
        
        return convertedPlan;
      } catch (error) {
        lastError = error;
        console.error(`Error on save attempt ${retryCount + 1}/${maxRetries}:`, error);
        
        // Log detailed error information
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        } else {
          console.error('Unknown error type:', error);
        }
        
        retryCount++;
        
        if (retryCount < maxRetries) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we get here, all retries failed
    console.error('All save attempts failed after retries');
    throw lastError;
  } catch (error) {
    console.error('Error saving business plan:', error);
    
    // Fall back to local storage if Supabase save fails
    try {
      console.log('Falling back to local storage...');
      const localPlan = await saveBusinessPlanToLocalStorage(businessPlan);
      console.log('Successfully saved to local storage:', localPlan);
      return localPlan;
    } catch (localError) {
      console.error('Error saving to local storage:', localError);
      throw error; // Throw the original error
    }
  }
}

/**
 * Custom hook for business plan operations
 */
export function useBusinessPlanService() {
  const { user } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

  /**
   * Saves a business plan to the user's dashboard
   * @param businessPlan The business plan to save
   * @returns The ID of the saved business plan
   */
  const saveBusinessPlan = useCallback(async (businessPlan: BusinessPlan): Promise<string> => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      if (!user) {
        const error = new Error('User must be authenticated to save a business plan');
        setSaveError(error);
        toast({
          title: "Authentication Required",
          description: "You must be signed in to save a business plan.",
          variant: "destructive",
        });
        throw error;
      }

      // Enhanced validation for required fields
      const requiredFields = ['title', 'business_idea', 'location', 'category'];
      const missingFields = requiredFields.filter(field => !businessPlan[field as keyof BusinessPlan]);
      
      if (missingFields.length > 0) {
        const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        setSaveError(error);
        console.error('Missing required fields for Supabase save:', missingFields, businessPlan);
        toast({
          title: "Missing Required Fields",
          description: `The business plan is missing required fields: ${missingFields.join(', ')}.`,
          variant: "destructive",
        });
        throw error;
      }

      // Convert the business plan to the format expected by Supabase
      const supabaseBusinessPlan = {
        title: businessPlan.title || 'Untitled Business Plan',
        business_idea: businessPlan.business_idea,
        location: businessPlan.location,
        category: businessPlan.category || 'New Company',
        sections: Array.isArray(businessPlan.sections) ? businessPlan.sections : []
      };
      
      console.log('Saving business plan to Supabase:', supabaseBusinessPlan);
      
      // Save to Supabase with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      let savedPlan = null;
      let lastError = null;
      
      while (retryCount < maxRetries && !savedPlan) {
        try {
          toast({
            title: "Saving Business Plan",
            description: retryCount > 0 ? `Retry attempt ${retryCount}/${maxRetries}...` : "Saving your business plan...",
          });
          
          // Save to Supabase
          savedPlan = await createSupabaseBusinessPlan(supabaseBusinessPlan);
          
          if (!savedPlan) {
            throw new Error('Failed to save business plan - no data returned');
          }
          
          console.log('Successfully saved business plan to Supabase:', savedPlan);
          
          toast({
            title: "Business Plan Saved",
            description: "Your business plan has been saved successfully.",
          });
          
          return savedPlan.id;
        } catch (error) {
          lastError = error;
          console.error(`Error on save attempt ${retryCount + 1}/${maxRetries}:`, error);
          
          retryCount++;
          
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      // If we get here, all retries failed
      console.error('All save attempts failed after retries');
      setSaveError(lastError instanceof Error ? lastError : new Error('Failed to save business plan'));
      
      toast({
        title: "Error Saving Business Plan",
        description: lastError instanceof Error ? lastError.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      
      throw lastError;
    } catch (error) {
      console.error('Error saving business plan:', error);
      setSaveError(error instanceof Error ? error : new Error('Unknown error'));
      
      toast({
        title: "Error Saving Business Plan",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [user, toast]);

  /**
   * Retrieves all business plans for the current user
   * @returns An array of business plans
   */
  const getBusinessPlans = useCallback(async (): Promise<BusinessPlan[]> => {
    try {
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching business plans:', error);
      return [];
    }
  }, [user, supabase]);

  /**
   * Retrieves a business plan by ID
   * @param id The ID of the business plan to retrieve
   * @returns The business plan, or null if not found
   */
  const getBusinessPlanById = useCallback(async (id: string): Promise<BusinessPlan | null> => {
    try {
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Error fetching business plan:', error);
      return null;
    }
  }, [user, supabase]);

  return {
    saveBusinessPlan,
    getBusinessPlans,
    getBusinessPlanById,
  };
}

/**
 * Save a business plan to local storage
 */
async function saveBusinessPlanToLocalStorage(businessPlan: BusinessPlan): Promise<BusinessPlan> {
  try {
    console.log('Saving business plan to local storage:', businessPlan);
    
    // Generate a unique ID for the business plan
    const id = businessPlan.id || `plan-${Date.now()}`;
    console.log('Generated ID for business plan:', id);
    
    // Add metadata to the business plan
    const planWithMetadata: BusinessPlan = {
      ...businessPlan,
      id,
      created_at: businessPlan.created_at || new Date().toISOString(),
    };
    console.log('Business plan with metadata:', planWithMetadata);
    
    // Get existing business plans from local storage
    const existingPlans = getBusinessPlansFromStorage();
    console.log('Existing business plans:', existingPlans);
    
    // Add the new business plan to the list
    const updatedPlans = [planWithMetadata, ...existingPlans.filter(plan => plan.id !== id)];
    console.log('Updated business plans list:', updatedPlans);
    
    // Save the updated list to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
      console.log('Saved business plans to local storage');
    }
    
    return planWithMetadata;
  } catch (error) {
    console.error('Error saving business plan to local storage:', error);
    throw error;
  }
}

/**
 * Helper function to get a business plan by ID from local storage
 */
function getBusinessPlanByIdFromStorage(id: string): BusinessPlan | null {
  // Get all business plans
  const businessPlans = getBusinessPlansFromStorage();
  
  // Find the business plan with the matching ID
  const businessPlan = businessPlans.find(plan => plan.id === id);
  
  return businessPlan || null;
}

/**
 * Helper function to delete a business plan from local storage
 */
function deleteBusinessPlanFromStorage(id: string): boolean {
  try {
    // Get all business plans
    const businessPlans = getBusinessPlansFromStorage();
    
    // Filter out the business plan with the matching ID
    const updatedPlans = businessPlans.filter(plan => plan.id !== id);
    
    // Save the updated list to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting business plan from local storage:', error);
    return false;
  }
}

/**
 * Get business plans from local storage
 */
export function getBusinessPlansFromStorage(): BusinessPlan[] {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return [];
    }
    
    // Get the business plans from local storage
    const plansJson = localStorage.getItem(BUSINESS_PLANS_STORAGE_KEY);
    
    // If there are no business plans, return an empty array
    if (!plansJson) {
      return [];
    }
    
    // Parse the business plans from JSON
    return JSON.parse(plansJson);
  } catch (error) {
    console.error('Error getting business plans from local storage:', error);
    return [];
  }
} 