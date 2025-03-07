import { NextRequest, NextResponse } from 'next/server';
import { determineBusinessCategory, extractBusinessType } from '@/lib/ai/businessPlanUtils';
import { performPerplexityResearch } from '@/lib/ai/perplexityResearch';

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.json();
    
    // Extract the necessary information
    const businessIdea = formData.businessIdea || '';
    const location = formData.location || '';
    const stage = formData.stage || '';
    
    // Determine the business category
    const category = determineBusinessCategory(stage);
    
    // Extract the business type
    const businessType = extractBusinessType(businessIdea);
    
    console.log('Performing research for:');
    console.log('Business Type:', businessType);
    console.log('Location:', location);
    console.log('Category:', category);
    
    // Perform the research
    const researchResults = await performPerplexityResearch(
      businessType,
      location,
      category
    );
    
    // Return the research results
    return NextResponse.json({
      success: true,
      category,
      businessType,
      research: researchResults,
    });
  } catch (error) {
    console.error('Error performing business plan research:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
} 