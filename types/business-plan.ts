import { Database } from './supabase'

export type BusinessPlanStatus = 'draft' | 'completed' | 'archived';

export interface BusinessPlanSection {
    title: string;
    content: string;
    order: number;
}

export interface BusinessPlanDetails {
    mission?: string;
    vision?: string;
    objectives?: string[];
    targetMarket?: {
        demographics?: string;
        psychographics?: string;
        location?: string;
        size?: string;
    };
    competitors?: Array<{
        name: string;
        strengths: string[];
        weaknesses: string[];
    }>;
    financials?: {
        startupCosts?: number;
        monthlyExpenses?: number;
        projectedRevenue?: number;
        breakEvenPoint?: number;
        fundingNeeded?: number;
    };
    marketing?: {
        strategies: string[];
        channels: string[];
        budget?: number;
    };
    swotAnalysis?: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
}

export interface BusinessPlanMetadata {
    industry?: string;
    stage?: 'idea' | 'startup' | 'growth' | 'established';
    teamSize?: number;
    location?: string;
    fundingStatus?: 'bootstrapped' | 'seeking' | 'funded';
    lastResearchUpdate?: string;
}

// Base business plan type from database schema
export type BusinessPlan = Database['public']['Tables']['business_plans']['Row'] & {
    details?: BusinessPlanDetails;
    metadata?: BusinessPlanMetadata;
    sections?: {
        executiveSummary: BusinessPlanSection;
        businessDescription: BusinessPlanSection;
        marketAnalysis: BusinessPlanSection;
        competitiveAnalysis: BusinessPlanSection;
        productsAndServices: BusinessPlanSection;
        marketingStrategy: BusinessPlanSection;
        financialProjections: BusinessPlanSection;
        implementationTimeline: BusinessPlanSection;
        riskAssessment: BusinessPlanSection;
    };
};

export interface CreateBusinessPlanInput {
    name: string;
    description?: string;
    business_idea?: string;
    location?: string;
    target_market?: string;
    solution?: string;
    business_stage?: string;
    team_size?: number;
    revenue_model?: string;
    funding_needs?: string;
    growth_goals?: string;
    marketing_strategy?: string;
    key_resources?: string;
    additional_notes?: string;
    is_public?: boolean;
    details?: BusinessPlanDetails;
    metadata?: BusinessPlanMetadata;
    sections?: Partial<BusinessPlan['sections']>;
}

// Type alias for BusinessPlanInput used in the businessPlans.ts file
export type BusinessPlanInput = {
    title: string;
    business_idea: string;
    location: string;
    category: string;
    sections?: any;
    details?: BusinessPlanDetails;
    metadata?: BusinessPlanMetadata;
    status?: BusinessPlanStatus;
    version?: number;
    is_public?: boolean;
    tags?: string[];
};

export interface UpdateBusinessPlanInput extends Partial<CreateBusinessPlanInput> {
    status?: BusinessPlanStatus;
    version?: number;
}

export interface BusinessPlanFilters {
    status?: BusinessPlanStatus;
    is_public?: boolean;
    search?: string;
}

export interface BusinessPlanFormData {
    businessIdea: string;
    location: string;
    targetMarket: string;
    problemSolution: string;
    businessStage: string;
    teamSize: number;
    revenueModel: string;
    fundingNeeds: number;
    growthGoals: string;
    marketingStrategy: string;
    keyResources: string;
    additionalNotes?: string;
}

// Type alias for CompletedBusinessPlan used in the businessPlans.ts file
export type CompletedBusinessPlan = BusinessPlan;