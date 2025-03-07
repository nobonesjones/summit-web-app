import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log('Suggestions API called');
    
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { currentQuestion, previousAnswers } = body;

    if (!currentQuestion) {
      console.error('Missing currentQuestion in request');
      return NextResponse.json(
        { error: 'Current question is required' },
        { status: 400 }
      );
    }

    // Extract business idea and location from previous answers
    const businessIdea = previousAnswers.businessIdea || '';
    const location = previousAnswers.location || '';
    
    console.log('Business idea:', businessIdea);
    console.log('Location:', location);

    // Create a prompt based on the current question and previous answers
    let prompt = '';
    
    if (currentQuestion.id === 'targetMarket') {
      prompt = `Based on the following business idea and location, suggest 3 potential target markets:
      
Business Idea: ${businessIdea}
Location: ${location}

Provide 3 specific, diverse target market suggestions that would be appropriate for this business. Each suggestion should be concise (1 sentence). Be direct, optimistic but use as few words as possible.`;
    } else {
      // Generic prompt for other questions
      prompt = `Based on the following business information, suggest 3 potential answers for the question: "${currentQuestion.text}"
      
Business Idea: ${businessIdea}
Location: ${location}
Question: ${currentQuestion.text}

Provide 3 specific, diverse suggestions that would be appropriate for this business. Each suggestion should be concise (1 sentence). Be direct, optimistic but use as few words as possible.`;
    }

    console.log('Using prompt:', prompt);
    console.log('OpenAI API Key available:', !!process.env.OPENAI_API_KEY);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return NextResponse.json(
        { 
          error: 'OpenAI API key is missing',
          suggestions: [
            { id: 'fallback-1', text: 'Young professionals in Dubai who value convenience and have limited time for traditional coffee shops.' },
            { id: 'fallback-2', text: 'Coffee enthusiasts looking for premium, freshly roasted beans delivered to their doorstep.' },
            { id: 'fallback-3', text: 'Busy office workers who want quality coffee without the hassle of preparation.' },
          ] 
        },
        { status: 200 }
      );
    }

    try {
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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

      console.log('OpenAI response:', JSON.stringify(response.choices[0]?.message));

      // Extract suggestions from the response
      const content = response.choices[0]?.message?.content || '';
      
      // Parse the suggestions (assuming they're numbered or in a list)
      const suggestionLines = content
        .split('\n')
        .filter(line => line.trim())
        .filter(line => line.match(/^\d+[\.\)]\s+/) || line.match(/^-\s+/))
        .map(line => line.replace(/^\d+[\.\)]\s+/, '').replace(/^-\s+/, '').trim());

      console.log('Parsed suggestion lines:', suggestionLines);

      // Format suggestions for the frontend
      const suggestions = suggestionLines.map((text, index) => ({
        id: `ai-${index + 1}`,
        text,
      }));

      // If no suggestions were parsed, create fallback suggestions
      if (suggestions.length === 0) {
        console.log('No suggestions parsed, using fallback suggestions');
        return NextResponse.json({
          suggestions: [
            { id: 'fallback-1', text: 'Young professionals in Dubai who value convenience and have limited time for traditional coffee shops.' },
            { id: 'fallback-2', text: 'Coffee enthusiasts looking for premium, freshly roasted beans delivered to their doorstep.' },
            { id: 'fallback-3', text: 'Busy office workers who want quality coffee without the hassle of preparation.' },
          ]
        });
      }

      console.log('Returning suggestions:', suggestions);
      return NextResponse.json({ suggestions });
    } catch (openAiError: any) {
      console.error('OpenAI API error:', openAiError);
      
      // Return fallback suggestions if OpenAI fails
      return NextResponse.json({
        error: 'OpenAI API error: ' + openAiError.message,
        suggestions: [
          { id: 'fallback-1', text: 'Young professionals in Dubai who value convenience and have limited time for traditional coffee shops.' },
          { id: 'fallback-2', text: 'Coffee enthusiasts looking for premium, freshly roasted beans delivered to their doorstep.' },
          { id: 'fallback-3', text: 'Busy office workers who want quality coffee without the hassle of preparation.' },
        ]
      });
    }
  } catch (error: any) {
    console.error('Error in suggestions API:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate suggestions',
        suggestions: [
          { id: 'error-1', text: 'Young professionals in Dubai who value convenience and have limited time for traditional coffee shops.' },
          { id: 'error-2', text: 'Coffee enthusiasts looking for premium, freshly roasted beans delivered to their doorstep.' },
          { id: 'error-3', text: 'Busy office workers who want quality coffee without the hassle of preparation.' },
        ]
      },
      { status: 200 }
    );
  }
} 