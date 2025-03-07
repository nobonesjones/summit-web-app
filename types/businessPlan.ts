/**
 * Business Plan Types
 */

export interface BusinessPlanSection {
  title: string;
  content: string;
}

export interface BusinessPlan {
  id?: string;
  title: string;
  businessIdea: string;
  location: string;
  category: string;
  sections: BusinessPlanSection[];
  createdAt?: string;
} 