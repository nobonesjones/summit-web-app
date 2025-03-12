import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * API endpoint for generating content using OpenAI
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { prompt, max_tokens = 1000, model = 'gpt-4o-mini' } = body;

    // Validate the request
    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    // Generate content using OpenAI
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a business plan expert that provides concise, practical, and data-driven content. Focus on actionable insights and specific metrics. Avoid generic business jargon and fluffy language.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens,
      temperature: 0.7,
    });

    // Extract the generated content
    const content = response.choices[0]?.message?.content || '';

    // Return the generated content
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 