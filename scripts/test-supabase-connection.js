#!/usr/bin/env node

/**
 * This script tests the Supabase connection and creates a business plan
 * Run with: node scripts/test-supabase-connection.js
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

// The business plan section provided
const providedSection = [
  {
    "title": "Executive Summary",
    "content": "This is a test executive summary for fixing."
  }
];

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test the connection by getting the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Error with auth check:', authError.message);
    } else {
      console.log('✅ Auth check successful!', user ? 'User found' : 'No user in context');
    }
    
    // Check if we can list users (requires service role)
    console.log('🔍 Checking if we can list users (requires service role)...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message);
      console.error('❌ Make sure you are using the service role key.');
    } else {
      console.log(`✅ Successfully listed users! Found ${users.users.length} users.`);
      
      // Get the first user to use for the business plan
      if (users.users.length > 0) {
        const testUser = users.users[0];
        console.log(`📋 Will use user: ${testUser.email} (${testUser.id})`);
        
        // Now try to create a business plan
        console.log('🔍 Attempting to create a business plan...');
        
        // First check if the business_plans table exists
        const { error: tableCheckError } = await supabase
          .from('business_plans')
          .select('id')
          .limit(1);
        
        if (tableCheckError) {
          if (tableCheckError.code === '42P01') {
            console.error('❌ The business_plans table does not exist.');
            console.log('🔧 Creating the business_plans table...');
            
            // Create the table using a simple insert (will fail, but that's expected)
            try {
              await supabase
                .from('business_plans')
                .insert([
                  {
                    user_id: testUser.id,
                    title: 'Test Plan',
                    business_idea: 'Test',
                    location: 'Test',
                    category: 'Test',
                    sections: []
                  }
                ]);
            } catch (createTableError) {
              console.error('❌ Could not automatically create the table.');
              console.log('🔧 Please create the business_plans table manually in the Supabase dashboard.');
              console.log('🔧 You can use the SQL from scripts/check-business-plans-table.js');
              return;
            }
          } else {
            console.error('❌ Error checking business_plans table:', tableCheckError.message);
            return;
          }
        }
        
        // Try to create the business plan
        const { data: planData, error: planError } = await supabase
          .from('business_plans')
          .insert([
            {
              user_id: testUser.id,
              title: 'Connection Test Business Plan',
              business_idea: 'Testing Supabase connection',
              location: 'Test Location',
              category: 'New Company',
              sections: providedSection
            }
          ])
          .select();
        
        if (planError) {
          console.error('❌ Error creating business plan:', planError.message);
          
          if (planError.code === '42P01') {
            console.log('🔧 The business_plans table does not exist. Please create it manually.');
          } else if (planError.code === '23503') {
            console.log('🔧 Foreign key constraint failed. Make sure the user exists.');
          } else if (planError.code === '42703') {
            console.log('🔧 Column does not exist. Check your table schema.');
          }
        } else {
          console.log('✅ Business plan created successfully!');
          console.log('📋 Business plan data:', JSON.stringify(planData, null, 2));
        }
      }
    }
    
    // Test direct PostgreSQL connection info
    console.log('\n🔍 About PostgreSQL direct connection:');
    console.log('ℹ️ You provided a PostgreSQL connection string:');
    console.log('postgresql://postgres.pqmrlxuiqaenfhssduik:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres');
    console.log('ℹ️ For security reasons, we recommend using the Supabase client with URL and keys instead of direct PostgreSQL connections.');
    console.log('ℹ️ The Supabase client is already configured in your app with the environment variables in .env.local');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testSupabaseConnection(); 