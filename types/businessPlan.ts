/**
 * Business Plan Types
 */

export interface BusinessPlanSection {
  title: string;
  content: string;
}

export interface BusinessPlan {
  id?: string;
  user_id?: string;
  title: string;
  business_idea: string;
  location: string;
  category: string;
  sections: BusinessPlanSection[];
  created_at?: string;
} 