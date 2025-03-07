/**
 * Configuration for all mini-apps in the platform
 */

export interface MiniAppConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'coming-soon';
  path: string;
  features: string[];
  tags: string[];
}

/**
 * Configuration for the Business Plan Generator mini-app
 */
export const businessPlanConfig: MiniAppConfig = {
  id: 'business-plan',
  title: 'Business Plan Generator',
  description: 'Create a comprehensive business plan for your startup or small business idea.',
  icon: '/icons/business-plan.svg',
  status: 'active',
  path: '/mini-apps/business-plan',
  features: [
    'Step-by-step guided form',
    'AI-generated business plan',
    'Market research integration',
    'Competitor analysis',
    'Financial projections',
    'Export to multiple formats',
  ],
  tags: ['business', 'startup', 'planning', 'entrepreneurship'],
};

/**
 * Configuration for the Marketing Strategy mini-app
 */
export const marketingStrategyConfig: MiniAppConfig = {
  id: 'marketing-strategy',
  title: 'Marketing Strategy Builder',
  description: 'Develop a targeted marketing strategy for your product or service.',
  icon: '/icons/marketing-strategy.svg',
  status: 'coming-soon',
  path: '/mini-apps/marketing-strategy',
  features: [
    'Target audience analysis',
    'Channel selection',
    'Content strategy',
    'Budget planning',
    'ROI projections',
    'Implementation timeline',
  ],
  tags: ['marketing', 'advertising', 'growth', 'strategy'],
};

/**
 * Configuration for the Product Roadmap mini-app
 */
export const productRoadmapConfig: MiniAppConfig = {
  id: 'product-roadmap',
  title: 'Product Roadmap Planner',
  description: 'Plan your product development timeline with features and milestones.',
  icon: '/icons/product-roadmap.svg',
  status: 'coming-soon',
  path: '/mini-apps/product-roadmap',
  features: [
    'Feature prioritization',
    'Timeline visualization',
    'Resource allocation',
    'Dependency mapping',
    'Milestone tracking',
    'Stakeholder views',
  ],
  tags: ['product', 'development', 'planning', 'roadmap'],
};

/**
 * Configuration for the Pitch Deck mini-app
 */
export const pitchDeckConfig: MiniAppConfig = {
  id: 'pitch-deck',
  title: 'Pitch Deck Creator',
  description: 'Create a compelling pitch deck for investors and stakeholders.',
  icon: '/icons/pitch-deck.svg',
  status: 'coming-soon',
  path: '/mini-apps/pitch-deck',
  features: [
    'Slide templates',
    'Content suggestions',
    'Design customization',
    'Investor-focused messaging',
    'Export to PDF/PowerPoint',
    'Presentation tips',
  ],
  tags: ['fundraising', 'investors', 'presentation', 'startup'],
};

/**
 * All mini-apps configuration
 */
export const miniAppsConfig: MiniAppConfig[] = [
  businessPlanConfig,
  marketingStrategyConfig,
  productRoadmapConfig,
  pitchDeckConfig,
];

/**
 * Get a mini-app configuration by ID
 */
export function getMiniAppConfig(id: string): MiniAppConfig | undefined {
  return miniAppsConfig.find(app => app.id === id);
}

/**
 * Get all active mini-apps
 */
export function getActiveMiniApps(): MiniAppConfig[] {
  return miniAppsConfig.filter(app => app.status === 'active');
}

/**
 * Get all coming soon mini-apps
 */
export function getComingSoonMiniApps(): MiniAppConfig[] {
  return miniAppsConfig.filter(app => app.status === 'coming-soon');
} 