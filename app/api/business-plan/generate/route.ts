import { NextRequest, NextResponse } from 'next/server';
import { generateBusinessPlan } from '@/lib/ai/businessPlanGenerator';

/**
 * API endpoint for generating a business plan
 */
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { formData, researchResults } = body;

    // Validate the request
    if (!formData) {
      return NextResponse.json(
        { error: 'Missing form data' },
        { status: 400 }
      );
    }

    if (!researchResults) {
      return NextResponse.json(
        { error: 'Missing research results' },
        { status: 400 }
      );
    }

    // Generate the business plan
    const businessPlan = await generateBusinessPlan(formData, researchResults);

    // Return the business plan
    return NextResponse.json({ businessPlan });
  } catch (error) {
    console.error('Error generating business plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate business plan', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 