/**
 * Business Plan Service
 * 
 * This file contains functions for storing and retrieving business plans.
 */

import { BusinessPlan } from '@/types/businessPlan';

// Local storage key for business plans
const BUSINESS_PLANS_STORAGE_KEY = 'summit_business_plans';

/**
 * Save a business plan to local storage
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
    localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
    
    return planWithMetadata;
  } catch (error) {
    console.error('Error saving business plan:', error);
    throw error;
  }
}

/**
 * Get all business plans from local storage
 */
export function getBusinessPlans(): BusinessPlan[] {
  try {
    // In a real implementation, this would fetch from a database
    return getBusinessPlansFromStorage();
  } catch (error) {
    console.error('Error getting business plans:', error);
    return [];
  }
}

/**
 * Get a business plan by ID
 */
export function getBusinessPlanById(id: string): BusinessPlan | null {
  try {
    // Get all business plans
    const businessPlans = getBusinessPlansFromStorage();
    
    // Find the business plan with the matching ID
    const businessPlan = businessPlans.find(plan => plan.id === id);
    
    return businessPlan || null;
  } catch (error) {
    console.error('Error getting business plan by ID:', error);
    return null;
  }
}

/**
 * Delete a business plan by ID
 */
export function deleteBusinessPlan(id: string): boolean {
  try {
    // Get all business plans
    const businessPlans = getBusinessPlansFromStorage();
    
    // Filter out the business plan with the matching ID
    const updatedPlans = businessPlans.filter(plan => plan.id !== id);
    
    // Save the updated list to local storage
    localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
    
    return true;
  } catch (error) {
    console.error('Error deleting business plan:', error);
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