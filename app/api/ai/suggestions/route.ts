import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Perplexity client (as a fallback)
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export async function POST(req: NextRequest) {
  try {
    console.log('Suggestions API called');
    
    const body = await req.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    const { currentQuestion, previousAnswers, allAnswers, userId } = body;

    if (!currentQuestion) {
      console.error('Missing currentQuestion in request');
      return NextResponse.json(
        { error: 'Current question is required' },
        { status: 400 }
      );
    }

    // Use allAnswers if available, otherwise fall back to previousAnswers
    const answers = allAnswers || previousAnswers || {};
    console.log('Using answers for context:', JSON.stringify(answers, null, 2));
    console.log('User ID:', userId);

    // Extract business information from answers
    const businessIdea = answers.businessIdea || '';
    const location = answers.location || '';
    const targetMarket = answers.targetMarket || '';
    const businessStage = answers.businessStage || '';
    const teamSize = answers.teamSize || '';
    
    console.log('Business idea:', businessIdea);
    console.log('Location:', location);
    console.log('Target market:', targetMarket);
    console.log('Business stage:', businessStage);
    console.log('Team size:', teamSize);

    // Check if we have enough context to generate meaningful suggestions
    const hasMinimalContext = currentQuestion.id === 'businessIdea' || 
                             (currentQuestion.id !== 'businessIdea' && businessIdea);
    
    if (!hasMinimalContext) {
      console.log('Insufficient context for meaningful suggestions, using generic ones');
      return NextResponse.json({
        suggestions: generateGenericSuggestions(currentQuestion.id)
      });
    }

    // Create a prompt based on the current question and previous answers
    let prompt = '';
    
    // Generate appropriate prompt based on the current question
    switch (currentQuestion.id) {
      case 'businessIdea':
        prompt = `Suggest 3 specific business ideas that could be successful. Each suggestion should be concise (1 sentence). Be direct and specific.`;
        break;
      case 'location':
        prompt = `Based on the following business idea, suggest 3 potential locations where this business could thrive:
        
Business Idea: ${businessIdea}

Provide 3 specific, diverse location suggestions. Each suggestion should be concise (1 sentence). Be direct and specific.`;
        break;
      case 'targetMarket':
        prompt = `Based on the following business idea and location, suggest 3 potential target markets:
        
Business Idea: ${businessIdea}
Location: ${location}

Provide 3 specific, diverse target market suggestions that would be appropriate for this business. Each suggestion should be concise (1 sentence). Be direct and specific, no unecessary words, don't include any answers in asterixes **answer** 15 words or less e.g "High net worth individuals that own luxury vehicles in the uae" `;
        break;
      default:
        // Generic prompt for other questions
        prompt = `Based on the following business information, suggest 3 potential answers for the question: "${currentQuestion.text}"
        
Business Idea: ${businessIdea}
Location: ${location}
Target Market: ${targetMarket}
Business Stage: ${businessStage}
Team Size: ${teamSize}
Question: ${currentQuestion.text}

Provide 3 specific, diverse suggestions that would be appropriate for this business. Each suggestion should be concise (1 sentence). Be direct and specific, no unecessary words, don't include any answers in asterixes **answer** 15 words or less e.g "We help hotels get more bookings by maximising their instagram, tiktok and facebook reach"`;
    }

    console.log('Using prompt:', prompt);
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key is missing, checking for Perplexity API key');
      
      // Try using Perplexity API as a fallback
      if (PERPLEXITY_API_KEY) {
        console.log('Using Perplexity API as fallback');
        try {
          const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
            },
            body: JSON.stringify({
              model: 'llama-3-sonar-small-32k-online',
              messages: [
                {
                  role: 'system',
                  content: 'You are a helpful business planning assistant. Provide concise, specific suggestions for business planning questions. Your suggestions should be directly related to the user\'s business idea and location.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 300
            })
          });
          
          if (!perplexityResponse.ok) {
            console.error(`Perplexity API error: ${perplexityResponse.status}`);
            throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
          }
          
          const perplexityData = await perplexityResponse.json();
          console.log('Perplexity API response received');
          
          const content = perplexityData.choices[0]?.message?.content || '';
          console.log('Perplexity response content:', content);
          
          // Parse the suggestions (assuming they're numbered or in a list)
          const suggestionLines = content
            .split('\n')
            .filter((line: string) => line.trim())
            .filter((line: string) => line.match(/^\d+[\.\)]\s+/) || line.match(/^-\s+/))
            .map((line: string) => line.replace(/^\d+[\.\)]\s+/, '').replace(/^-\s+/, '').trim());
          
          console.log('Parsed suggestion lines:', suggestionLines);
          
          if (suggestionLines.length > 0) {
            const suggestions = suggestionLines.map((text: string, index: number) => ({
              id: `ai-${index + 1}`,
              text,
            }));
            return NextResponse.json({ suggestions });
          }
          
          // If no suggestions were parsed, try a different parsing approach
          const alternativeSuggestions = content
            .split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0 && line.length < 150);
          
          if (alternativeSuggestions.length > 0) {
            const suggestions = alternativeSuggestions.slice(0, 3).map((text: string, index: number) => ({
              id: `ai-${index + 1}`,
              text,
            }));
            return NextResponse.json({ suggestions });
          }
        } catch (perplexityError: any) {
          console.error('Perplexity API error:', perplexityError);
        }
      }
      
      // If Perplexity API fails or is not available, use contextual fallback suggestions
      console.log('Using contextual fallback suggestions');
      const contextualSuggestions = generateContextualFallbackSuggestions(currentQuestion.id, {
        businessIdea,
        location,
        targetMarket,
        businessStage,
        teamSize
      });
      
      console.log('Generated contextual fallback suggestions:', contextualSuggestions);
      
      return NextResponse.json(
        { 
          error: 'AI API keys are missing or invalid',
          suggestions: contextualSuggestions
        },
        { status: 200 }
      );
    }

    try {
      // Call OpenAI API
      console.log('Calling OpenAI API...');
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful business planning assistant. Provide concise, specific suggestions for business planning questions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      console.log('OpenAI response received');
      console.log('Response content:', response.choices[0]?.message?.content);

      // Extract suggestions from the response
      const content = response.choices[0]?.message?.content || '';
      
      // Parse the suggestions (assuming they're numbered or in a list)
      const suggestionLines = content
        .split('\n')
        .filter((line: string) => line.trim())
        .filter((line: string) => line.match(/^\d+[\.\)]\s+/) || line.match(/^-\s+/))
        .map((line: string) => line.replace(/^\d+[\.\)]\s+/, '').replace(/^-\s+/, '').trim());

      console.log('Parsed suggestion lines:', suggestionLines);

      // If no suggestions were parsed, try a different parsing approach
      if (suggestionLines.length === 0) {
        console.log('No suggestions parsed with standard format, trying alternative parsing');
        // Try to split by newlines and take non-empty lines
        const alternativeSuggestions = content
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0 && line.length < 150); // Reasonable length for a suggestion
        
        if (alternativeSuggestions.length > 0) {
          console.log('Found alternative suggestions:', alternativeSuggestions);
          const suggestions = alternativeSuggestions.slice(0, 3).map((text: string, index: number) => ({
            id: `ai-${index + 1}`,
            text,
          }));
          return NextResponse.json({ suggestions });
        }
      }

      // Format suggestions for the frontend
      const suggestions = suggestionLines.map((text: string, index: number) => ({
        id: `ai-${index + 1}`,
        text,
      }));

      // If no suggestions were parsed, create fallback suggestions
      if (suggestions.length === 0) {
        console.log('No suggestions parsed, using fallback suggestions');
        return NextResponse.json({
          suggestions: generateGenericSuggestions(currentQuestion.id)
        });
      }

      console.log('Returning suggestions:', suggestions);
      return NextResponse.json({ suggestions });
    } catch (openAiError: any) {
      console.error('OpenAI API error:', openAiError);
      
      // Generate contextual fallback suggestions based on the user's inputs
      const contextualSuggestions = generateContextualFallbackSuggestions(currentQuestion.id, {
        businessIdea,
        location,
        targetMarket,
        businessStage,
        teamSize
      });
      
      console.log('Generated contextual fallback suggestions after OpenAI error:', contextualSuggestions);
      
      // Return fallback suggestions if OpenAI fails
      return NextResponse.json({
        error: 'OpenAI API error: ' + openAiError.message,
        suggestions: contextualSuggestions
      });
    }
  } catch (error: any) {
    console.error('Error in suggestions API:', error);
    
    // Generate contextual fallback suggestions based on the user's inputs
    const contextualSuggestions = generateContextualFallbackSuggestions('default', {
      businessIdea: '',
      location: '',
      targetMarket: '',
      businessStage: '',
      teamSize: ''
    });
    
    console.log('Generated contextual fallback suggestions for general error:', contextualSuggestions);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate suggestions',
        suggestions: contextualSuggestions
      },
      { status: 200 }
    );
  }
}

// Helper function to generate generic suggestions based on the question type
function generateGenericSuggestions(questionId: string) {
  switch (questionId) {
    case 'businessIdea':
      return [
        { id: 'generic-1', text: 'A subscription service for essential products in your local area.' },
        { id: 'generic-2', text: 'A specialized consulting firm focused on a growing industry.' },
        { id: 'generic-3', text: 'An e-commerce platform selling locally-made products.' },
      ];
    case 'location':
      return [
        { id: 'generic-1', text: 'A central business district with high foot traffic.' },
        { id: 'generic-2', text: 'A growing residential neighborhood with limited competition.' },
        { id: 'generic-3', text: 'An online presence with local delivery capabilities.' },
      ];
    case 'targetMarket':
      return [
        { id: 'generic-1', text: 'Young professionals with disposable income and busy schedules.' },
        { id: 'generic-2', text: 'Small business owners looking to optimize their operations.' },
        { id: 'generic-3', text: 'Families seeking convenient, high-quality solutions.' },
      ];
    case 'businessStage':
      return [
        { id: 'generic-1', text: 'Early concept stage with initial market research completed.' },
        { id: 'generic-2', text: 'Prototype or MVP ready for initial customer testing.' },
        { id: 'generic-3', text: 'Established business looking to expand or pivot.' },
      ];
    default:
      return [
        { id: 'generic-1', text: 'Consider options that align with your business goals and target market.' },
        { id: 'generic-2', text: 'Think about what would best support your business idea and location.' },
        { id: 'generic-3', text: 'Explore various possibilities that complement your existing business plan.' },
      ];
  }
}

// Add this function at the end of the file
function generateContextualFallbackSuggestions(questionId: string, context: any) {
  console.log('Generating contextual fallback suggestions for:', questionId);
  console.log('Using context:', context);
  
  const { businessIdea, location, targetMarket, businessStage, teamSize } = context;
  
  // Clean and format the business idea for better readability in suggestions
  const cleanBusinessIdea = businessIdea ? businessIdea.trim() : '';
  
  switch (questionId) {
    case 'businessIdea':
      return [
        { id: 'fallback-1', text: 'A subscription-based service for professionals in your area' },
        { id: 'fallback-2', text: 'An online marketplace connecting local producers with consumers' },
        { id: 'fallback-3', text: 'A specialized consulting service for small businesses' },
      ];
      
    case 'location':
      if (cleanBusinessIdea) {
        return [
          { id: 'fallback-1', text: `Major metropolitan areas where ${cleanBusinessIdea} would be in high demand` },
          { id: 'fallback-2', text: `Business districts with high foot traffic for ${cleanBusinessIdea}` },
          { id: 'fallback-3', text: `Emerging markets with growing demand for ${cleanBusinessIdea}` },
        ];
      }
      return generateGenericSuggestions(questionId);
      
    case 'targetMarket':
      if (cleanBusinessIdea) {
        // Create more specific suggestions based on the business idea
        if (cleanBusinessIdea.toLowerCase().includes('phone') || cleanBusinessIdea.toLowerCase().includes('iphone')) {
          return [
            { id: 'fallback-1', text: `Young professionals and business users in ${location || 'urban areas'} who need premium smartphones` },
            { id: 'fallback-2', text: `Middle to upper-income consumers in ${location || 'your region'} looking for quality tech products` },
            { id: 'fallback-3', text: `Students and young adults in ${location || 'major cities'} who prioritize having the latest technology` },
          ];
        } else if (cleanBusinessIdea.toLowerCase().includes('food') || cleanBusinessIdea.toLowerCase().includes('restaurant')) {
          return [
            { id: 'fallback-1', text: `Urban professionals in ${location || 'the area'} looking for convenient dining options` },
            { id: 'fallback-2', text: `Families in ${location || 'residential neighborhoods'} seeking quality meal experiences` },
            { id: 'fallback-3', text: `Health-conscious consumers in ${location || 'your region'} interested in nutritious food options` },
          ];
        } else if (cleanBusinessIdea.toLowerCase().includes('software') || cleanBusinessIdea.toLowerCase().includes('app')) {
          return [
            { id: 'fallback-1', text: `Tech-savvy professionals in ${location || 'urban centers'} looking for productivity solutions` },
            { id: 'fallback-2', text: `Small to medium businesses in ${location || 'your target region'} needing specialized software` },
            { id: 'fallback-3', text: `Young adults in ${location || 'major cities'} who frequently use mobile applications` },
          ];
        } else {
          // Generic but still using the business idea and location
          return [
            { id: 'fallback-1', text: `Young professionals in ${location || 'urban areas'} who would benefit from ${cleanBusinessIdea}` },
            { id: 'fallback-2', text: `Middle-income consumers in ${location || 'your region'} interested in products like ${cleanBusinessIdea}` },
            { id: 'fallback-3', text: `Small to medium businesses in ${location || 'major markets'} that could use ${cleanBusinessIdea}` },
          ];
        }
      }
      return generateGenericSuggestions(questionId);
      
    case 'businessStage':
      return [
        { id: 'fallback-1', text: `Early-stage startup seeking initial market validation for ${cleanBusinessIdea || 'your business idea'}` },
        { id: 'fallback-2', text: `Established business looking to expand ${cleanBusinessIdea || 'your offerings'} into new markets` },
        { id: 'fallback-3', text: `Growing company ready to scale operations for ${cleanBusinessIdea || 'your products/services'}` },
      ];
      
    case 'teamSize':
      return [
        { id: 'fallback-1', text: `Solo founder with plans to hire as ${cleanBusinessIdea || 'the business'} grows` },
        { id: 'fallback-2', text: `Small team of 2-5 people with complementary skills needed for ${cleanBusinessIdea || 'your business'}` },
        { id: 'fallback-3', text: `Medium-sized team of 6-15 employees across different functions to support ${cleanBusinessIdea || 'your operations'}` },
      ];
      
    default:
      // For other questions, try to provide somewhat relevant suggestions
      if (cleanBusinessIdea) {
        return [
          { id: 'fallback-1', text: `Consider options that align with your ${cleanBusinessIdea} business in ${location || 'your target market'}` },
          { id: 'fallback-2', text: `Choose an approach that matches your business goals for ${cleanBusinessIdea}` },
          { id: 'fallback-3', text: `Select what works best for ${cleanBusinessIdea} in ${location || 'your specific market'}` },
        ];
      }
      return generateGenericSuggestions('default');
  }
} 