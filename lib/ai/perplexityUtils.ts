import axios from 'axios';

/**
 * Perform a web search using the Perplexity API
 */
export async function performWebSearch(query: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are a helpful research assistant. Provide detailed, accurate information based on web searches.' },
          { role: 'user', content: query }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error performing web search:', error);
    return 'Failed to perform web search. Please try again later.';
  }
}

/**
 * Research market conditions for a business plan
 */
export async function researchMarketConditions(
  businessIdea: string,
  location: string
): Promise<string> {
  const query = `Research current market conditions for a ${businessIdea} business in ${location}. Include market size, growth trends, and key challenges.`;
  return performWebSearch(query);
}

/**
 * Research competitors for a business plan
 */
export async function researchCompetitors(
  businessIdea: string,
  location: string
): Promise<string> {
  const query = `Identify and analyze key competitors for a ${businessIdea} business in ${location}. Include their strengths, weaknesses, and market positioning.`;
  return performWebSearch(query);
}

/**
 * Research industry trends for a business plan
 */
export async function researchIndustryTrends(
  businessIdea: string
): Promise<string> {
  const query = `Research the latest trends and innovations in the ${businessIdea} industry. Include emerging technologies, changing consumer preferences, and future outlook.`;
  return performWebSearch(query);
}

/**
 * Generate a SWOT analysis for a business plan
 */
export async function generateSWOTAnalysis(
  businessIdea: string,
  location: string,
  targetMarket: string
): Promise<{
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}> {
  const query = `Generate a detailed SWOT analysis for a ${businessIdea} business in ${location} targeting ${targetMarket}. Format the response as a structured SWOT analysis with clear sections for Strengths, Weaknesses, Opportunities, and Threats.`;
  
  try {
    const result = await performWebSearch(query);
    
    // This is a simplified implementation
    // In a real application, you would parse the response more carefully
    
    // For now, we'll create a mock response
    return {
      strengths: [
        'Innovative business model',
        'Strong target market alignment',
        'Potential for recurring revenue'
      ],
      weaknesses: [
        'Limited initial resources',
        'New market entrant',
        'Dependency on external suppliers'
      ],
      opportunities: [
        'Growing market demand',
        'Potential for expansion to nearby areas',
        'Partnership possibilities with complementary businesses'
      ],
      threats: [
        'Established competitors',
        'Economic uncertainty',
        'Changing regulations'
      ]
    };
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    return {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    };
  }
} 