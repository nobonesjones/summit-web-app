/**
 * Business Plan Generator
 * 
 * This file contains functions for generating business plans.
 */

import { determineBusinessCategory, extractBusinessType } from './businessPlanUtils';

/**
 * Generates a business plan based on the form data and research results
 */
export async function generateBusinessPlan(formData: Record<string, string>, researchResults: string) {
  try {
    // Determine the business category
    const category = determineBusinessCategory(formData.stage || '');
    
    // Extract the business type
    const businessType = extractBusinessType(formData.businessIdea || '');
    
    // Get the business name (or a default if not provided)
    const businessName = formData.businessName || `${businessType.charAt(0).toUpperCase() + businessType.slice(1)} Business`;
    
    // Get the sections for this business category
    const sections = getSectionsForCategory(category);
    
    // Generate each section of the business plan
    const businessPlanSections = await Promise.all(
      sections.map(async (section) => {
        const sectionContent = await generateBusinessPlanSection(
          businessName,
          category,
          section.title,
          section.subsections,
          formData,
          researchResults
        );
        
        return {
          title: section.title,
          content: sectionContent,
        };
      })
    );
    
    return {
      title: `${businessName} Business Plan`,
      category,
      sections: businessPlanSections,
    };
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw error;
  }
}

/**
 * Gets the base URL for API calls
 */
function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Use the current window location
    return window.location.origin;
  }
  
  // For server-side rendering, use environment variables if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3001';
}

/**
 * Generates a section of the business plan
 */
async function generateBusinessPlanSection(
  businessName: string,
  category: 'New Company' | 'Scale-Up' | 'Established',
  sectionTitle: string,
  subsections: string[],
  formData: Record<string, string>,
  researchResults: string
): Promise<string> {
  try {
    // Create the prompt for generating this section
    const prompt = `# Business Plan Section Generator for ${businessName} (${category})

Based on the research provided for ${extractBusinessType(formData.businessIdea || '')} in ${formData.location || ''}, generate the following section for my business plan:

## ${sectionTitle}

Create content for each subsection below that is:
- Direct and actionable (no business jargon or fluffy language)
- Data-driven with specific numbers/metrics where relevant
- Focused on practical implementation
- 50-80 words per subsection

Include the following subsections:
${subsections.join('\n')}

For each subsection:
1. Start with the most impactful information first
2. Include at least one specific metric or data point where applicable
3. Focus on what makes this business unique in this market
4. End with an actionable insight or next step
5. Avoid generic statements that could apply to any business

Format each subsection with its heading in bold, followed by the concise content.

Form Data:
${Object.entries(formData)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}

Research Results:
${researchResults}`;

    // Get the base URL for API calls
    const baseUrl = getBaseUrl();
    
    // Call the OpenAI API to generate the section
    const response = await fetch(`${baseUrl}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate section: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.content || '';
  } catch (error) {
    console.error(`Error generating section ${sectionTitle}:`, error);
    return `Error generating ${sectionTitle}: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Gets the sections for the specified business category
 */
function getSectionsForCategory(category: 'New Company' | 'Scale-Up' | 'Established'): Array<{
  title: string;
  subsections: string[];
}> {
  switch (category) {
    case 'New Company':
      return [
        {
          title: 'Executive Summary',
          subsections: [
            'Vision & Mission',
            'Core Problem & Solution',
            'Target Market & Opportunity',
            'Early Traction Metrics',
            'Team Highlights',
            'Financial Projections Snapshot',
          ],
        },
        {
          title: 'Market Analysis',
          subsections: [
            'Industry Overview & Stage',
            'Market Size & Addressable Segments',
            'Market Trends & Growth Drivers',
            'Competitor Analysis (direct & indirect)',
            'Competitive Advantage & Differentiation',
          ],
        },
        {
          title: 'Product-Market Fit Focus',
          subsections: [
            'Problem Statement & Evidence',
            'Solution Validation (customer feedback, early metrics)',
            'Target Customer Profile & Pain Points',
            'Expansion Opportunities (future horizons)',
          ],
        },
        {
          title: 'Revenue Engine',
          subsections: [
            'Core Offering & Value Proposition',
            'Pricing Strategy & Unit Economics',
            'Sales Process & Customer Acquisition Cost',
          ],
        },
        {
          title: 'Marketing & Acquisition',
          subsections: [
            'Marketing Overview & Positioning',
            'Digital Marketing Strategy (with specific channels)',
            'Social Media Strategy & Content Plan',
            'Customer Acquisition Metrics & Goals',
          ],
        },
        {
          title: 'Execution Plan',
          subsections: [
            '90-Day Action Plan (specific weekly goals)',
            'Customer Acquisition Strategy',
            'Critical Metrics Dashboard',
            'Cash Runway & Burn Rate',
          ],
        },
        {
          title: 'Team & Resources',
          subsections: [
            'Key Roles & Responsibilities',
            'Critical Skills Gaps',
            'Minimum Viable Resources',
            'Mentor/Advisor Network',
          ],
        },
        {
          title: 'Risk Analysis',
          subsections: [
            'Critical Market Risks',
            'Operational Vulnerabilities',
            'Financial Risks & Mitigation Plans',
            'Competitive Threats',
          ],
        },
        {
          title: 'Financial Roadmap',
          subsections: [
            'Monthly Cash Flow (12 months)',
            'Break-even Timeline',
            'Funding Requirements & Milestones',
          ],
        },
      ];

    case 'Scale-Up':
      return [
        {
          title: 'Executive Summary',
          subsections: [
            'Growth Trajectory & Achievements',
            'Market Opportunity & Expansion Strategy',
            'Competitive Position',
            'Team Evolution',
            'Financial Performance & Projections',
          ],
        },
        {
          title: 'Market Landscape',
          subsections: [
            'Industry Overview & Dynamics',
            'Market Size & Growth Trajectory',
            'Emerging Market Trends',
            'Competitor Analysis & Market Share',
            'Expansion Opportunities (geographic/demographic)',
          ],
        },
        {
          title: 'Growth Acceleration Strategy',
          subsections: [
            'Market Expansion Opportunities',
            'Customer Segment Analysis',
            'Scaling Evidence & Metrics',
            'Competitive Differentiation',
          ],
        },
        {
          title: 'Revenue Optimization',
          subsections: [
            'Product Portfolio Strategy',
            'Customer Lifetime Value Enhancement',
            'Pricing Structure & Optimization',
            'Recurring Revenue Streams',
          ],
        },
        {
          title: 'Marketing & Brand Strategy',
          subsections: [
            'Marketing Overview & Budget Allocation',
            'Brand Development Strategy',
            'Social Media Strategy & Engagement Metrics',
            'Digital Marketing Optimization (performance data)',
            'Content Strategy & Thought Leadership',
          ],
        },
        {
          title: 'Operational Scalability',
          subsections: [
            'Process Automation & Standardization',
            'Technology Infrastructure Plan',
            'Quality Control Systems',
            'Supply Chain/Vendor Management',
          ],
        },
        {
          title: 'Organizational Development',
          subsections: [
            'Org Structure & Key Hires (18-month plan)',
            'Culture & Retention Strategy',
            'Decision-making Framework',
            'Performance Management System',
          ],
        },
        {
          title: 'Risk Analysis',
          subsections: [
            'Scaling Risks & Contingencies',
            'Market Positioning Risks',
            'Financial & Funding Risks',
            'Operational Bottlenecks',
            'Regulatory Compliance',
          ],
        },
        {
          title: 'Financial Strategy',
          subsections: [
            'Unit Economics Across Segments',
            'Capital Allocation Framework',
            'Funding Strategy & Options',
            'Profitability Path & Timeline',
          ],
        },
      ];

    case 'Established':
      return [
        {
          title: 'Executive Summary',
          subsections: [
            'Long-term Position & Vision',
            'Market Leadership Status',
            'Innovation & Adaptation Strategy',
            'Financial Performance Highlights',
            'Strategic Priorities',
          ],
        },
        {
          title: 'Industry & Market Analysis',
          subsections: [
            'Industry Overview & Maturity Assessment',
            'Market Size & Segmentation Analysis',
            'Market Trends & Disruptive Forces',
            'Competitor Analysis & Positioning Map',
            'Strategic Industry Alliances',
          ],
        },
        {
          title: 'Market Position Enhancement',
          subsections: [
            'Brand Equity Assessment',
            'Market Share Analysis & Goals',
            'Customer Loyalty Metrics',
            'Expansion Opportunities (new verticals/markets)',
          ],
        },
        {
          title: 'Innovation & Adaptation Strategy',
          subsections: [
            'Product/Service Evolution Roadmap',
            'Digital Transformation Initiatives',
            'Emerging Technology Integration',
            'R&D Investment Framework',
          ],
        },
        {
          title: 'Marketing & Brand Leadership',
          subsections: [
            'Marketing Overview & Investment Strategy',
            'Brand Portfolio Management',
            'Social Media Strategy & Brand Advocacy',
            'Digital Marketing Optimization & ROI Analysis',
            'Integrated Marketing Campaigns',
          ],
        },
        {
          title: 'Operational Excellence',
          subsections: [
            'Efficiency Optimization Plan',
            'Cost Structure Analysis',
            'Supply Chain Resilience',
            'Environmental & Social Impact Goals',
          ],
        },
        {
          title: 'Talent & Organization',
          subsections: [
            'Leadership Development Pipeline',
            'Knowledge Management Systems',
            'Strategic Hiring Framework',
            'Succession Planning',
          ],
        },
        {
          title: 'Risk Analysis',
          subsections: [
            'Market Disruption Risks',
            'Industry Consolidation Impact',
            'Regulatory & Compliance Landscape',
            'Technological Obsolescence',
            'Reputation Management',
          ],
        },
        {
          title: 'Financial Performance',
          subsections: [
            'Shareholder Value Creation Model',
            'Capital Structure Optimization',
            'Risk Management Framework',
            'Long-term Investment Strategy',
          ],
        },
      ];
  }
} 