/**
 * Business Plan Utilities
 * 
 * This file contains utility functions for the business plan generator.
 */

/**
 * Determines the business category based on the user's answers
 * 
 * Categories:
 * - "New Company" for those that answered concept/idea, prototype/MVP, or First Few Customers
 * - "Scale-Up" for those that answered Already In Business Scaling Up
 * - "Established" for those that answered Established Business
 */
export function determineBusinessCategory(stageAnswer: string): 'New Company' | 'Scale-Up' | 'Established' {
  // Parse the stage answer (could be multiple selections)
  const stages = stageAnswer.split(', ');
  
  // Check if any of the stages match the established business criteria
  if (stages.some(stage => stage.includes('established'))) {
    return 'Established';
  }
  
  // Check if any of the stages match the scale-up criteria
  if (stages.some(stage => stage.includes('scaling'))) {
    return 'Scale-Up';
  }
  
  // Default to New Company
  return 'New Company';
}

/**
 * Extracts the business type from the business idea
 */
export function extractBusinessType(businessIdea: string): string {
  // This is a simple implementation - in a real-world scenario, 
  // you might want to use NLP to extract the business type
  const words = businessIdea.split(' ');
  
  // Look for common business type indicators
  const businessTypes = [
    'coffee', 'restaurant', 'cafe', 'shop', 'store', 'service',
    'app', 'platform', 'software', 'tech', 'technology',
    'subscription', 'delivery', 'marketplace', 'consulting',
    'agency', 'studio', 'firm', 'company', 'business'
  ];
  
  for (const word of words) {
    const normalizedWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (businessTypes.includes(normalizedWord)) {
      return normalizedWord;
    }
  }
  
  // If no specific type is found, return a generic type
  return 'business';
} 