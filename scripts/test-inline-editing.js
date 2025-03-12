#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Check for required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables for Supabase connection.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInlineEditing() {
  console.log('Testing inline editing functionality for business plans...');

  try {
    // Use a known user ID from previous tests
    const testUser = {
      id: '822aafdc-3858-491e-978f-ae9bdd0a451d',
      email: 'winner@summitos.com'
    };
    
    console.log(`Using test user: ${testUser.email} (${testUser.id})`);

    // 2. Create a test business plan
    const testBusinessPlan = {
      user_id: testUser.id,
      title: 'Original Title',
      business_idea: 'Original business idea for testing inline editing',
      location: 'Original Location',
      category: 'Original Category',
      sections: [
        {
          title: 'Executive Summary',
          content: 'Original executive summary content for testing inline editing.'
        },
        {
          title: 'Market Analysis',
          content: 'Original market analysis content for testing inline editing.'
        }
      ],
      status: 'draft'
    };

    // Insert the test business plan
    const { data: insertedPlan, error: insertError } = await supabase
      .from('business_plans')
      .insert(testBusinessPlan)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error inserting test business plan: ${insertError.message}`);
    }

    console.log('Successfully created test business plan with ID:', insertedPlan.id);
    console.log('Original business plan data:', JSON.stringify(insertedPlan, null, 2));

    // 3. Simulate inline editing by updating the business plan
    const updatedBusinessPlan = {
      title: 'Updated Title after inline editing',
      business_idea: 'Updated business idea after inline editing',
      location: 'Updated Location',
      category: 'Updated Category',
      sections: [
        {
          title: 'Executive Summary',
          content: 'Updated executive summary content after inline editing.'
        },
        {
          title: 'Market Analysis',
          content: 'Updated market analysis content after inline editing.'
        }
      ]
    };

    // Update the business plan
    const { data: updatedPlan, error: updateError } = await supabase
      .from('business_plans')
      .update(updatedBusinessPlan)
      .eq('id', insertedPlan.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Error updating business plan: ${updateError.message}`);
    }

    console.log('Successfully updated business plan with inline edits');
    console.log('Updated business plan data:', JSON.stringify(updatedPlan, null, 2));

    // 4. Verify the updates were saved correctly
    const { data: verifiedPlan, error: verifyError } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', insertedPlan.id)
      .single();

    if (verifyError) {
      throw new Error(`Error verifying business plan updates: ${verifyError.message}`);
    }

    console.log('Verification successful. Current business plan data:');
    console.log(JSON.stringify(verifiedPlan, null, 2));

    // 5. Clean up - delete the test business plan
    const { error: deleteError } = await supabase
      .from('business_plans')
      .delete()
      .eq('id', insertedPlan.id);

    if (deleteError) {
      console.warn(`Warning: Could not delete test business plan: ${deleteError.message}`);
    } else {
      console.log(`Successfully deleted test business plan with ID: ${insertedPlan.id}`);
    }

    console.log('Inline editing test completed successfully!');
  } catch (error) {
    console.error('Error during inline editing test:', error.message);
    process.exit(1);
  }
}

// Run the test
testInlineEditing(); 