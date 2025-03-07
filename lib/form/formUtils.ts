import { z } from 'zod';

// Define the schema for business plan form data
export const businessPlanSchema = z.object({
  businessIdea: z.string().min(10, 'Please provide a more detailed business idea'),
  businessLocation: z.string().min(2, 'Please specify a location'),
  targetMarket: z.string().min(5, 'Please describe your target market'),
  solution: z.string().min(10, 'Please explain how your solution solves the problem'),
  businessStage: z.string(),
  teamSize: z.string(),
  revenueModel: z.string().min(5, 'Please describe how you will make money'),
  fundingNeeds: z.string(),
  growthGoals: z.string().min(5, 'Please describe your growth goals'),
  customerAcquisition: z.string().min(5, 'Please explain how you will reach customers'),
  keyResources: z.string().min(5, 'Please list the key resources you need'),
  additionalInfo: z.string().optional(),
});

export type BusinessPlanFormData = z.infer<typeof businessPlanSchema>;

// Define the questions for the business plan form
export const businessPlanQuestions = [
  {
    id: 'businessIdea',
    question: 'What is your business idea?',
    placeholder: 'E.g. A mobile coffee subscription service that delivers weekly.',
    inputType: 'textarea' as const,
  },
  {
    id: 'businessLocation',
    question: 'Where is your business located?',
    placeholder: 'E.g. Dubai, UAE or Dubai with global online presence',
    inputType: 'text' as const,
  },
  {
    id: 'targetMarket',
    question: 'Who is your target market?',
    placeholder: 'E.g. Young professionals, coffee enthusiasts, busy parents',
    inputType: 'textarea' as const,
  },
  {
    id: 'solution',
    question: 'How does your solution solve the problem?',
    placeholder: 'E.g. Delivering fresh coffee directly saves time and ensures quality',
    inputType: 'textarea' as const,
  },
  {
    id: 'businessStage',
    question: 'What stage is your business at currently?',
    inputType: 'select' as const,
    options: [
      { value: 'concept', label: 'Early concept' },
      { value: 'prototype', label: 'Prototype testing' },
      { value: 'mvp', label: 'Minimum viable product' },
      { value: 'paying-customers', label: 'First paying customers' },
      { value: 'scaling', label: 'Scaling the business' },
    ],
  },
  {
    id: 'teamSize',
    question: 'How many team members do you have?',
    inputType: 'select' as const,
    options: [
      { value: 'solo', label: 'Solo founder' },
      { value: 'co-founders', label: '2-3 co-founders' },
      { value: 'small-team', label: '4-10 employees' },
      { value: 'medium-team', label: '11-50 employees' },
      { value: 'large-team', label: '50+ employees' },
    ],
  },
  {
    id: 'revenueModel',
    question: 'How will you make money?',
    placeholder: 'E.g. Subscription model at 99 AED/month, one-time purchases',
    inputType: 'textarea' as const,
  },
  {
    id: 'fundingNeeds',
    question: 'What are your funding needs?',
    placeholder: 'E.g. 200K AED for initial inventory and marketing',
    inputType: 'text' as const,
  },
  {
    id: 'growthGoals',
    question: 'What are your growth goals?',
    placeholder: 'E.g. 500 subscribers in year one, expand to Abu Dhabi by year two',
    inputType: 'textarea' as const,
  },
  {
    id: 'customerAcquisition',
    question: 'How will you reach your customers?',
    placeholder: 'E.g. Instagram ads, local events, word of mouth',
    inputType: 'textarea' as const,
  },
  {
    id: 'keyResources',
    question: 'What key resources do you need?',
    placeholder: 'E.g. Coffee roasting equipment, delivery vehicles, website',
    inputType: 'textarea' as const,
  },
  {
    id: 'additionalInfo',
    question: 'Is there anything else we should know?',
    placeholder: 'E.g. Partnership with local roasters, seasonal menu planned',
    inputType: 'textarea' as const,
  },
];

// Helper function to get the next question
export function getNextQuestion(currentQuestionId: string): string | null {
  const currentIndex = businessPlanQuestions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex === -1 || currentIndex === businessPlanQuestions.length - 1) {
    return null;
  }
  
  return businessPlanQuestions[currentIndex + 1].id;
}

// Helper function to get the previous question
export function getPreviousQuestion(currentQuestionId: string): string | null {
  const currentIndex = businessPlanQuestions.findIndex(q => q.id === currentQuestionId);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return businessPlanQuestions[currentIndex - 1].id;
} 