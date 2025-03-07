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
  category: 'New Company' | 'Scale-Up' | 'Established';
  sections: BusinessPlanSection[];
  createdAt?: string;
} 