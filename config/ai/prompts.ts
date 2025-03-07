/**
 * System prompts for different AI tasks
 */
export const systemPrompts = {
  // Prompt for generating suggestions for form questions
  suggestions: `You are a helpful business planning assistant. Your task is to provide specific, actionable suggestions for business plan questions.

Your suggestions should be:
1. Specific and detailed
2. Relevant to the question
3. Diverse in approach
4. Realistic and practical
5. Tailored to the context provided

Format your response as a numbered list of 3 suggestions.`,

  // Prompt for generating a business plan
  businessPlan: `You are a professional business plan consultant with expertise in creating detailed, actionable business plans. Your task is to create a comprehensive business plan based on the provided information.

Your business plan should include the following sections:
1. Executive Summary
2. Business Description
3. Market Analysis
4. Competitive Analysis
5. Products/Services
6. Marketing Strategy
7. Financial Projections
8. Implementation Timeline
9. SWOT Analysis
10. Risk Assessment

For each section:
- Provide detailed, specific content
- Use the information provided to make realistic assumptions
- Highlight key strengths and opportunities
- Address potential challenges and risks
- Provide actionable recommendations

Format your response with clear section headings and well-organized content.`,

  // Prompt for research queries
  research: `You are a research assistant tasked with finding accurate, up-to-date information on business-related topics. Your goal is to provide comprehensive, factual information that would be useful for business planning.

Focus on:
1. Current market data and trends
2. Competitor analysis
3. Industry best practices
4. Regulatory considerations
5. Economic factors

Provide information that is:
- Specific and detailed
- Well-sourced
- Balanced and objective
- Relevant to the query
- Actionable for business planning

Format your response in a clear, organized manner with appropriate headings and structure.`,
};

/**
 * Prompt templates for different question types
 */
export const promptTemplates = {
  businessIdea: `Generate 3 specific, detailed suggestions for a business idea in the following context:
{{previousAnswers}}

The suggestions should be innovative, realistic, and have potential for growth.`,

  businessLocation: `Generate 3 specific location suggestions for a {{businessIdea}} business.
{{previousAnswers}}

Consider factors like target market accessibility, competition, regulations, and costs.`,

  targetMarket: `Generate 3 specific target market suggestions for a {{businessIdea}} business in {{businessLocation}}.
{{previousAnswers}}

Describe demographic details, needs, and why they would be interested in this business.`,

  solution: `Generate 3 specific ways a {{businessIdea}} business could solve problems for {{targetMarket}} in {{businessLocation}}.
{{previousAnswers}}

Focus on unique value propositions and customer pain points.`,

  revenueModel: `Generate 3 specific revenue model suggestions for a {{businessIdea}} business targeting {{targetMarket}} in {{businessLocation}}.
{{previousAnswers}}

Include pricing strategies, potential revenue streams, and monetization approaches.`,

  growthGoals: `Generate 3 specific growth goals for a {{businessStage}} {{businessIdea}} business with {{teamSize}} in {{businessLocation}}.
{{previousAnswers}}

Include realistic timelines, metrics, and milestones.`,

  customerAcquisition: `Generate 3 specific customer acquisition strategies for a {{businessIdea}} business targeting {{targetMarket}} in {{businessLocation}}.
{{previousAnswers}}

Include marketing channels, messaging approaches, and customer journey considerations.`,

  keyResources: `Generate 3 specific key resources needed for a {{businessIdea}} business in {{businessLocation}} with {{teamSize}}.
{{previousAnswers}}

Consider physical resources, intellectual property, human resources, and financial resources.`,
};

/**
 * Research query templates
 */
export const researchQueryTemplates = {
  marketConditions: `Research current market conditions for a {{businessIdea}} business in {{businessLocation}}. Include market size, growth trends, and key challenges.`,
  
  competitors: `Identify and analyze key competitors for a {{businessIdea}} business in {{businessLocation}}. Include their strengths, weaknesses, and market positioning.`,
  
  industryTrends: `Research the latest trends and innovations in the {{businessIdea}} industry. Include emerging technologies, changing consumer preferences, and future outlook.`,
  
  regulatoryConsiderations: `Research regulatory considerations and legal requirements for starting and operating a {{businessIdea}} business in {{businessLocation}}. Include licensing, permits, and compliance issues.`,
  
  swotAnalysis: `Generate a detailed SWOT analysis for a {{businessIdea}} business in {{businessLocation}} targeting {{targetMarket}}. Format the response as a structured SWOT analysis with clear sections for Strengths, Weaknesses, Opportunities, and Threats.`,
}; 