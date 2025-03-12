/**
 * Application constants
 */

// Application metadata
export const APP_NAME = 'Summit';
export const APP_DESCRIPTION = 'AI-powered tools for entrepreneurs and business leaders';
export const APP_VERSION = '0.1.0';

// API endpoints and keys
export const OPENAI_API_URL = 'https://api.openai.com/v1';
export const PERPLEXITY_API_URL = 'https://api.perplexity.ai';

// Default models
export const DEFAULT_OPENAI_MODEL = 'gpt-4o';
export const DEFAULT_PERPLEXITY_MODEL = 'sonar';

// Form constants
export const MAX_BUSINESS_IDEA_LENGTH = 500;
export const MAX_SUGGESTIONS = 3;

// Business plan constants
export const BUSINESS_PLAN_SECTIONS = [
  'Executive Summary',
  'Business Description',
  'Market Analysis',
  'Competitive Analysis',
  'Products/Services',
  'Marketing Strategy',
  'Financial Projections',
  'Implementation Timeline',
  'SWOT Analysis',
  'Risk Assessment',
];

// File export formats
export const EXPORT_FORMATS = [
  { id: 'txt', name: 'Text File (.txt)', icon: 'file-text' },
  { id: 'html', name: 'HTML Document (.html)', icon: 'file-code' },
  { id: 'pdf', name: 'PDF Document (.pdf)', icon: 'file-pdf' },
];

// Navigation
export const MAIN_NAVIGATION = [
  { name: 'Home', href: '/' },
  { name: 'Mini-Apps', href: '/mini-apps' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

// Footer links
export const FOOTER_LINKS = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { name: 'GitHub', href: 'https://github.com', icon: 'github' },
  ],
}; 