import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server-async';

export async function POST(req: NextRequest) {
  try {
    // Create a Supabase client
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Create a test business plan
    const testPlan = {
      user_id: user.id,
      title: 'Test Business Plan',
      business_idea: 'This is a test business idea',
      location: 'Test Location',
      category: 'New Company',
      sections: [
        {
          title: 'Executive Summary',
          content: 'This is a test executive summary'
        }
      ],
      status: 'draft',
      version: 1,
      is_public: false,
      tags: [],
      updated_at: new Date().toISOString()
    };
    
    // Try to save the business plan to Supabase
    const { data: savedPlan, error } = await supabase
      .from('business_plans')
      .insert(testPlan)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error saving business plan to Supabase:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // Return the saved plan
    return NextResponse.json({ success: true, plan: savedPlan });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
} 