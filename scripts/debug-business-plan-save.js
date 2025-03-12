#!/usr/bin/env node

/**
 * This script debugs the business plan saving process
 * Run with: node scripts/debug-business-plan-save.js
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

async function debugBusinessPlanSave() {
  try {
    console.log('🔍 Debugging business plan save process...');
    
    // 1. Check if the business_plans table exists
    console.log('1️⃣ Checking if business_plans table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('business_plans')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error checking business_plans table:', tableError.message);
      console.error('❌ Error code:', tableError.code);
      console.error('❌ Error details:', tableError.details);
      return;
    }
    
    console.log('✅ business_plans table exists');
    
    // 2. Check if there are any business plans in the table
    console.log('2️⃣ Checking existing business plans...');
    const { data: plans, error: plansError } = await supabase
      .from('business_plans')
      .select('*');
    
    if (plansError) {
      console.error('❌ Error fetching business plans:', plansError.message);
      return;
    }
    
    console.log(`📋 Found ${plans.length} business plans`);
    if (plans.length > 0) {
      console.log('📋 Sample business plan:');
      console.log(JSON.stringify(plans[0], null, 2));
    }
    
    // 3. Check if there are any users in the auth.users table
    console.log('3️⃣ Checking users...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    if (!users || users.users.length === 0) {
      console.error('❌ No users found. Cannot create business plans without users.');
      return;
    }
    
    console.log(`📋 Found ${users.users.length} users`);
    console.log('📋 Sample user:');
    console.log(`ID: ${users.users[0].id}`);
    console.log(`Email: ${users.users[0].email}`);
    
    // 4. Try to create a business plan
    console.log('4️⃣ Attempting to create a business plan...');
    const userId = users.users[0].id;
    
    const testPlan = {
      user_id: userId,
      title: 'Debug Test Business Plan',
      business_idea: 'A debug test business idea',
      location: 'Debug Test Location',
      category: 'New Company',
      sections: [
        {
          title: 'Executive Summary',
          content: 'This is a debug test executive summary.'
        }
      ]
    };
    
    console.log('📋 Test plan data:');
    console.log(JSON.stringify(testPlan, null, 2));
    
    const { data: createdPlan, error: createError } = await supabase
      .from('business_plans')
      .insert([testPlan])
      .select();
    
    if (createError) {
      console.error('❌ Error creating business plan:', createError.message);
      console.error('❌ Error code:', createError.code);
      console.error('❌ Error details:', createError.details);
      
      // Check if it's a permission issue
      if (createError.code === 'PGRST301' || createError.message.includes('permission denied')) {
        console.log('⚠️ This appears to be a permission issue. Checking RLS policies...');
        
        // Try with service role
        console.log('🔧 Trying with service role...');
        const { data: serviceRoleData, error: serviceRoleError } = await supabase
          .from('business_plans')
          .insert([testPlan])
          .select();
        
        if (serviceRoleError) {
          console.error('❌ Error creating business plan with service role:', serviceRoleError.message);
        } else {
          console.log('✅ Business plan created successfully with service role:');
          console.log(JSON.stringify(serviceRoleData, null, 2));
          console.log('⚠️ This confirms it is an RLS policy issue. Check your RLS policies.');
        }
      }
    } else {
      console.log('✅ Business plan created successfully:');
      console.log(JSON.stringify(createdPlan, null, 2));
    }
    
    // 5. Check the RLS policies
    console.log('5️⃣ Checking RLS policies...');
    console.log('⚠️ You need to check RLS policies manually in the Supabase dashboard.');
    console.log('⚠️ Go to: https://app.supabase.com/project/_/auth/policies');
    console.log('⚠️ Ensure you have the following policies for the business_plans table:');
    console.log(`
      -- Users can view their own business plans
      CREATE POLICY "Users can view their own business plans" 
      ON public.business_plans FOR SELECT 
      USING (auth.uid() = user_id);
      
      -- Users can create their own business plans
      CREATE POLICY "Users can create their own business plans" 
      ON public.business_plans FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
      -- Users can update their own business plans
      CREATE POLICY "Users can update their own business plans" 
      ON public.business_plans FOR UPDATE 
      USING (auth.uid() = user_id);
      
      -- Users can delete their own business plans
      CREATE POLICY "Users can delete their own business plans" 
      ON public.business_plans FOR DELETE 
      USING (auth.uid() = user_id);
    `);
    
    // 6. Provide recommendations
    console.log('6️⃣ Recommendations:');
    console.log('1. Check that the user is authenticated when saving business plans');
    console.log('2. Ensure the user_id is correctly set to the authenticated user\'s ID');
    console.log('3. Verify that all required fields are provided (title, business_idea, location, category)');
    console.log('4. Check for any client-side errors in the browser console');
    console.log('5. Add more detailed error logging in the saveBusinessPlan function');
    
    console.log('✅ Debug process completed');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the debug process
debugBusinessPlanSave(); 