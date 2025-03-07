/**
 * Business Plan Service
 * 
 * This file contains functions for storing and retrieving business plans.
 */

import { useConvex } from 'convex/react';
import { BusinessPlan } from '@/types/businessPlan';
import { useCallback } from 'react';

// Local storage key for business plans
const BUSINESS_PLANS_STORAGE_KEY = 'summit_business_plans';

/**
 * Standalone function to save a business plan to local storage
 * This is a fallback for when Convex is not available
 */
export async function saveBusinessPlan(businessPlan: BusinessPlan): Promise<BusinessPlan> {
  try {
    // In a real implementation, this would save to a database
    // For now, we'll use local storage as a simple solution
    
    // Generate a unique ID for the business plan
    const id = `plan-${Date.now()}`;
    
    // Add metadata to the business plan
    const planWithMetadata: BusinessPlan = {
      ...businessPlan,
      id,
      createdAt: new Date().toISOString(),
    };
    
    // Get existing business plans from local storage
    const existingPlans = getBusinessPlansFromStorage();
    
    // Add the new business plan to the list
    const updatedPlans = [planWithMetadata, ...existingPlans];
    
    // Save the updated list to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
    }
    
    return planWithMetadata;
  } catch (error) {
    console.error('Error saving business plan:', error);
    throw error;
  }
}

/**
 * Custom hook for business plan operations
 */
export function useBusinessPlanService() {
  const convex = useConvex();

  /**
   * Saves a business plan to the user's dashboard
   * @param businessPlan The business plan to save
   * @returns The ID of the saved business plan
   */
  const saveBusinessPlan = useCallback(async (businessPlan: BusinessPlan): Promise<string> => {
    try {
      // For now, we'll use local storage as Convex integration is pending
      const savedPlan = await saveBusinessPlanToLocalStorage(businessPlan);
      return savedPlan.id || '';
    } catch (error) {
      console.error('Error saving business plan:', error);
      throw new Error('Failed to save business plan');
    }
  }, []);

  /**
   * Gets all business plans for the current user
   */
  const getBusinessPlans = useCallback(async () => {
    try {
      // For now, we'll use local storage as Convex integration is pending
      return getBusinessPlansFromStorage();
    } catch (error) {
      console.error('Error getting business plans:', error);
      return [];
    }
  }, []);

  /**
   * Gets a specific business plan by ID
   * @param id The ID of the business plan to get
   */
  const getBusinessPlanById = useCallback(async (id: string) => {
    try {
      // For now, we'll use local storage as Convex integration is pending
      return getBusinessPlanByIdFromStorage(id);
    } catch (error) {
      console.error('Error getting business plan:', error);
      return null;
    }
  }, []);

  /**
   * Deletes a business plan
   * @param id The ID of the business plan to delete
   */
  const deleteBusinessPlan = useCallback(async (id: string) => {
    try {
      // For now, we'll use local storage as Convex integration is pending
      return deleteBusinessPlanFromStorage(id);
    } catch (error) {
      console.error('Error deleting business plan:', error);
      return false;
    }
  }, []);

  return {
    saveBusinessPlan,
    getBusinessPlans,
    getBusinessPlanById,
    deleteBusinessPlan,
  };
}

/**
 * Helper function to save a business plan to local storage
 */
async function saveBusinessPlanToLocalStorage(businessPlan: BusinessPlan): Promise<BusinessPlan> {
  // Generate a unique ID for the business plan
  const id = `plan-${Date.now()}`;
  
  // Add metadata to the business plan
  const planWithMetadata: BusinessPlan = {
    ...businessPlan,
    id,
    createdAt: new Date().toISOString(),
  };
  
  // Get existing business plans from local storage
  const existingPlans = getBusinessPlansFromStorage();
  
  // Add the new business plan to the list
  const updatedPlans = [planWithMetadata, ...existingPlans];
  
  // Save the updated list to local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
  }
  
  return planWithMetadata;
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
 * Helper function to get business plans from local storage
 */
function getBusinessPlansFromStorage(): BusinessPlan[] {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return [];
  }
  
  // Get the business plans from local storage
  const businessPlansJson = localStorage.getItem(BUSINESS_PLANS_STORAGE_KEY);
  
  // If there are no business plans, return an empty array
  if (!businessPlansJson) {
    return [];
  }
  
  // Parse the JSON string into an array of business plans
  try {
    return JSON.parse(businessPlansJson);
  } catch (error) {
    console.error('Error parsing business plans from local storage:', error);
    return [];
  }
} 