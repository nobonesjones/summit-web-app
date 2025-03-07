import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate suggestions for a form question based on previous answers
 */
export async function generateSuggestions(
  question: string,
  previousAnswers: Record<string, string> = {}
): Promise<{ id: string; text: string }[]> {
  try {
    // Create a prompt that includes the question and previous answers
    let prompt = `Generate 3 helpful, specific suggestions for the following question: "${question}"\n\n`;
    
    // Add context from previous answers if available
    if (Object.keys(previousAnswers).length > 0) {
      prompt += "Based on the following information:\n";
      
      for (const [key, value] of Object.entries(previousAnswers)) {
        prompt += `- ${key}: ${value}\n`;
      }
    }
    
    prompt += "\nProvide 3 specific, detailed suggestions that would be helpful for answering this question.";
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful business planning assistant. Provide specific, actionable suggestions for business plan questions.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    // Parse the response
    const content = response.choices[0].message.content || '';
    
    // Split the content into separate suggestions
    // This assumes the model returns numbered suggestions like "1. Suggestion one", "2. Suggestion two", etc.
    const suggestionTexts = content
      .split(/\d+\.\s+/)
      .filter(Boolean)
      .map(text => text.trim());
    
    // Format the suggestions
    return suggestionTexts.map((text, index) => ({
      id: `suggestion-${index + 1}`,
      text,
    }));
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [];
  }
}

/**
 * Generate a business plan based on form answers
 */
export async function generateBusinessPlan(
  formData: Record<string, string>
): Promise<{ title: string; sections: { id: string; title: string; content: string }[] }> {
  try {
    // Create a prompt that includes all the form data
    let prompt = "Generate a comprehensive business plan based on the following information:\n\n";
    
    for (const [key, value] of Object.entries(formData)) {
      prompt += `${key}: ${value}\n`;
    }
    
    prompt += "\nCreate a detailed business plan with the following sections: Executive Summary, Business Description, Market Analysis, Competitive Analysis, Products/Services, Marketing Strategy, Financial Projections, Implementation Timeline, SWOT Analysis, and Risk Assessment.";
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a professional business plan consultant. Create detailed, actionable business plans based on the provided information.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    // This is a simplified implementation
    // In a real application, you would parse the response more carefully
    // and ensure the sections are properly formatted
    
    // For now, we'll create a mock response
    return {
      title: `Business Plan: ${formData.businessIdea?.substring(0, 50)}...`,
      sections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          content: 'This is a placeholder for the executive summary section.',
        },
        {
          id: 'business-description',
          title: 'Business Description',
          content: 'This is a placeholder for the business description section.',
        },
        {
          id: 'market-analysis',
          title: 'Market Analysis',
          content: 'This is a placeholder for the market analysis section.',
        },
        {
          id: 'competitive-analysis',
          title: 'Competitive Analysis',
          content: 'This is a placeholder for the competitive analysis section.',
        },
        {
          id: 'products-services',
          title: 'Products/Services',
          content: 'This is a placeholder for the products/services section.',
        },
        {
          id: 'marketing-strategy',
          title: 'Marketing Strategy',
          content: 'This is a placeholder for the marketing strategy section.',
        },
        {
          id: 'financial-projections',
          title: 'Financial Projections',
          content: 'This is a placeholder for the financial projections section.',
        },
        {
          id: 'implementation-timeline',
          title: 'Implementation Timeline',
          content: 'This is a placeholder for the implementation timeline section.',
        },
        {
          id: 'swot-analysis',
          title: 'SWOT Analysis',
          content: 'This is a placeholder for the SWOT analysis section.',
        },
        {
          id: 'risk-assessment',
          title: 'Risk Assessment',
          content: 'This is a placeholder for the risk assessment section.',
        },
      ],
    };
  } catch (error) {
    console.error('Error generating business plan:', error);
    throw new Error('Failed to generate business plan');
  }
} 