#!/usr/bin/env node

/**
 * This script debugs the specific error with saving business plans
 * Run with: node scripts/debug-business-plan-error.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or service role key not found in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Sample business plan data that matches the structure used in the app
const sampleBusinessPlan = {
  title: 'Debug Test Business Plan',
  business_idea: 'A debug test business idea',
  location: 'Debug Test Location',
  category: 'New Company',
  sections: [
    {
      title: 'Executive Summary',
      content: 'This is a test executive summary for fixing.'
    }
  ]
};

async function debugBusinessPlanError() {
  try {
    console.log('🔍 Debugging business plan save error...');
    
    // 1. Check if we can get the current user
    console.log('1️⃣ Checking if we can get the current user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting current user:', userError.message);
      console.log('🔧 This is expected when running from a script. We will use a test user instead.');
    } else if (user) {
      console.log('✅ Successfully got current user:', user.id);
    } else {
      console.log('⚠️ No current user. This is expected when running from a script.');
    }
    
    // 2. Get a test user
    console.log('2️⃣ Getting a test user...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message);
      return;
    }
    
    if (!users || users.users.length === 0) {
      console.error('❌ No users found. Cannot proceed with testing.');
      return;
    }
    
    const testUser = users.users[0];
    console.log(`✅ Using test user: ${testUser.email} (${testUser.id})`);
    
    // 3. Check the business_plans table structure
    console.log('3️⃣ Checking business_plans table structure...');
    
    try {
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ Error querying business_plans table:', error.message);
        console.error('❌ Error code:', error.code);
        
        if (error.code === '42P01') {
          console.error('❌ The business_plans table does not exist!');
          return;
        }
      } else {
        console.log('✅ Successfully queried business_plans table');
        
        if (data && data.length > 0) {
          console.log('📋 Sample record structure:');
          const sampleRecord = data[0];
          
          // Log the structure of the sample record
          const structure = {};
          for (const key in sampleRecord) {
            structure[key] = typeof sampleRecord[key];
          }
          
          console.log(JSON.stringify(structure, null, 2));
        }
      }
    } catch (tableError) {
      console.error('❌ Unexpected error checking table:', tableError.message);
    }
    
    // 4. Try to insert a business plan directly
    console.log('4️⃣ Trying to insert a business plan directly...');
    
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('business_plans')
        .insert([
          {
            user_id: testUser.id,
            title: sampleBusinessPlan.title,
            business_idea: sampleBusinessPlan.business_idea,
            location: sampleBusinessPlan.location,
            category: sampleBusinessPlan.category,
            sections: sampleBusinessPlan.sections
          }
        ])
        .select();
      
      if (insertError) {
        console.error('❌ Error inserting business plan:', insertError.message);
        console.error('❌ Error code:', insertError.code);
        console.error('❌ Error details:', insertError.details);
        
        // Check for specific error types
        if (insertError.code === '23502') {
          console.error('❌ NOT NULL constraint violation. A required field is missing.');
        } else if (insertError.code === '23503') {
          console.error('❌ Foreign key constraint violation. The user_id might not exist.');
        } else if (insertError.code === '42703') {
          console.error('❌ Column does not exist. The table schema might be different than expected.');
        }
        
        // Try to get more information about the table structure
        console.log('🔍 Getting more information about the table structure...');
        
        try {
          const { data: columnsData, error: columnsError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_name', 'business_plans');
          
          if (columnsError) {
            console.error('❌ Error getting column information:', columnsError.message);
          } else {
            console.log('📋 Table columns:');
            console.table(columnsData);
          }
        } catch (columnsError) {
          console.error('❌ Error getting column information:', columnsError.message);
        }
      } else {
        console.log('✅ Successfully inserted business plan!');
        console.log('📋 Inserted data:', JSON.stringify(insertData, null, 2));
      }
    } catch (insertError) {
      console.error('❌ Unexpected error inserting business plan:', insertError.message);
    }
    
    // 5. Check if there's a name vs title issue
    console.log('5️⃣ Checking for name vs title column issue...');
    
    try {
      const { data: nameData, error: nameError } = await supabase
        .from('business_plans')
        .insert([
          {
            user_id: testUser.id,
            name: 'Test Name Field',
            title: 'Test Title Field',
            business_idea: 'Testing name vs title',
            location: 'Test Location',
            category: 'Test Category',
            sections: []
          }
        ])
        .select();
      
      if (nameError) {
        console.error('❌ Error with name/title test:', nameError.message);
        
        if (nameError.code === '42703') {
          if (nameError.message.includes('name')) {
            console.error('❌ The "name" column does not exist. Use "title" instead.');
          } else if (nameError.message.includes('title')) {
            console.error('❌ The "title" column does not exist. Use "name" instead.');
          }
        }
      } else {
        console.log('✅ Successfully inserted with both name and title fields');
        console.log('📋 Inserted data:', JSON.stringify(nameData, null, 2));
      }
    } catch (nameError) {
      console.error('❌ Unexpected error with name/title test:', nameError.message);
    }
    
    // 6. Check for JSON handling issues
    console.log('6️⃣ Checking for JSON handling issues...');
    
    try {
      // Test with stringified JSON
      const { data: jsonData, error: jsonError } = await supabase
        .from('business_plans')
        .insert([
          {
            user_id: testUser.id,
            title: 'JSON Test Plan',
            business_idea: 'Testing JSON handling',
            location: 'Test Location',
            category: 'Test Category',
            sections: JSON.stringify(sampleBusinessPlan.sections)
          }
        ])
        .select();
      
      if (jsonError) {
        console.error('❌ Error with stringified JSON:', jsonError.message);
        
        // Try with raw JSON
        const { data: rawJsonData, error: rawJsonError } = await supabase
          .from('business_plans')
          .insert([
            {
              user_id: testUser.id,
              title: 'Raw JSON Test Plan',
              business_idea: 'Testing raw JSON handling',
              location: 'Test Location',
              category: 'Test Category',
              sections: sampleBusinessPlan.sections
            }
          ])
          .select();
        
        if (rawJsonError) {
          console.error('❌ Error with raw JSON:', rawJsonError.message);
          console.error('❌ This suggests there might be an issue with JSON handling.');
        } else {
          console.log('✅ Successfully inserted with raw JSON');
          console.log('📋 Inserted data:', JSON.stringify(rawJsonData, null, 2));
        }
      } else {
        console.log('✅ Successfully inserted with stringified JSON');
        console.log('📋 Inserted data:', JSON.stringify(jsonData, null, 2));
      }
    } catch (jsonError) {
      console.error('❌ Unexpected error with JSON test:', jsonError.message);
    }
    
    // 7. Provide recommendations
    console.log('7️⃣ Recommendations based on tests:');
    console.log('1. Check that the user is authenticated when saving business plans');
    console.log('2. Ensure the user_id is correctly set to the authenticated user\'s ID');
    console.log('3. Verify that all required fields are provided (title/name, business_idea, location, category)');
    console.log('4. Check for JSON handling issues with the sections field');
    console.log('5. Look for any client-side errors in the browser console');
    console.log('6. Add more detailed error logging in the saveBusinessPlan function');
    
    console.log('✅ Debug process completed');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the debug process
debugBusinessPlanError(); 