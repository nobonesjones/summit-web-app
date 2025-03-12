import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    console.log('Testing OpenAI API connection');
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 });
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    try {
      // Make a simple API call
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: 'Say hello!',
          },
        ],
        max_tokens: 10,
      });
      
      console.log('OpenAI response:', response);
      
      return NextResponse.json({
        success: true,
        message: response.choices[0]?.message?.content || 'No response content',
      });
    } catch (openAiError: any) {
      console.error('OpenAI API error:', openAiError);
      return NextResponse.json({
        error: 'OpenAI API error: ' + openAiError.message,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({
      error: 'Error: ' + error.message,
    }, { status: 500 });
  }
} 