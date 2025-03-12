#!/usr/bin/env node

/**
 * This script diagnoses and fixes issues with saving business plans
 * Run with: node scripts/fix-business-plan-save.js
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

async function fixBusinessPlanSave() {
  try {
    console.log('🔍 Diagnosing business plan save issues...');
    
    // 1. Check database schema
    console.log('1️⃣ Checking database schema...');
    
    // Check if business_plans table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('business_plans')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.error('❌ business_plans table does not exist. Creating it...');
      await createBusinessPlansTable();
    } else if (tableError) {
      console.error('❌ Error checking business_plans table:', tableError.message);
      console.error('❌ Error code:', tableError.code);
      console.error('❌ Error details:', tableError.details);
      return;
    } else {
      console.log('✅ business_plans table exists');
      
      // Check table schema
      console.log('🔍 Checking business_plans table schema...');
      const { data: columns, error: columnsError } = await supabase
        .rpc('execute_sql', {
          query: `
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'business_plans'
            ORDER BY ordinal_position
          `
        });
      
      if (columnsError) {
        console.error('❌ Error checking table schema:', columnsError.message);
      } else {
        console.log('📋 Table schema:');
        console.table(columns);
        
        // Check for required columns
        const requiredColumns = ['id', 'user_id', 'title', 'business_idea', 'location', 'category', 'sections'];
        const missingColumns = requiredColumns.filter(
          col => !columns.some(c => c.column_name === col)
        );
        
        if (missingColumns.length > 0) {
          console.error(`❌ Missing required columns: ${missingColumns.join(', ')}`);
          console.log('🔧 Adding missing columns...');
          
          for (const column of missingColumns) {
            await addMissingColumn(column);
          }
        } else {
          console.log('✅ All required columns exist');
        }
      }
    }
    
    // 2. Check RLS policies
    console.log('2️⃣ Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('execute_sql', {
        query: `
          SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
          FROM pg_policies
          WHERE tablename = 'business_plans'
        `
      });
    
    if (policiesError) {
      console.error('❌ Error checking RLS policies:', policiesError.message);
    } else {
      console.log('📋 RLS policies:');
      console.table(policies);
      
      // Check for required policies
      const requiredPolicies = [
        { cmd: 'SELECT', name: 'Users can view their own business plans' },
        { cmd: 'INSERT', name: 'Users can create their own business plans' },
        { cmd: 'UPDATE', name: 'Users can update their own business plans' },
        { cmd: 'DELETE', name: 'Users can delete their own business plans' }
      ];
      
      const missingPolicies = requiredPolicies.filter(
        policy => !policies.some(p => 
          p.cmd === policy.cmd && 
          p.policyname.includes(policy.name.toLowerCase().replace(/\s+/g, '_'))
        )
      );
      
      if (missingPolicies.length > 0) {
        console.error(`❌ Missing required policies: ${missingPolicies.map(p => p.name).join(', ')}`);
        console.log('🔧 Adding missing policies...');
        
        await createRLSPolicies();
      } else {
        console.log('✅ All required policies exist');
      }
    }
    
    // 3. Check if RLS is enabled
    console.log('3️⃣ Checking if RLS is enabled...');
    const { data: rlsEnabled, error: rlsError } = await supabase
      .rpc('execute_sql', {
        query: `
          SELECT relname, relrowsecurity
          FROM pg_class
          WHERE relname = 'business_plans'
        `
      });
    
    if (rlsError) {
      console.error('❌ Error checking RLS status:', rlsError.message);
    } else {
      console.log('📋 RLS status:');
      console.table(rlsEnabled);
      
      if (rlsEnabled.length > 0 && !rlsEnabled[0].relrowsecurity) {
        console.error('❌ RLS is not enabled for business_plans table');
        console.log('🔧 Enabling RLS...');
        
        await enableRLS();
      } else {
        console.log('✅ RLS is enabled');
      }
    }
    
    // 4. Test authentication flow
    console.log('4️⃣ Testing authentication flow...');
    
    // Get a list of users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    if (!users || users.users.length === 0) {
      console.error('❌ No users found. Cannot test authentication flow.');
      return;
    }
    
    console.log(`📋 Found ${users.users.length} users`);
    
    // Create a test client with a user token
    const testUser = users.users[0];
    console.log(`🔧 Testing with user: ${testUser.email} (${testUser.id})`);
    
    // 5. Test business plan creation
    console.log('5️⃣ Testing business plan creation...');
    
    // Create a test business plan
    const testPlan = {
      user_id: testUser.id,
      title: 'Fix Test Business Plan',
      business_idea: 'A test business idea for fixing',
      location: 'Fix Test Location',
      category: 'New Company',
      sections: [
        {
          title: 'Executive Summary',
          content: 'This is a test executive summary for fixing.'
        }
      ]
    };
    
    // Test with service role first (should always work)
    console.log('🔧 Testing with service role...');
    const { data: serviceRolePlan, error: serviceRoleError } = await supabase
      .from('business_plans')
      .insert([testPlan])
      .select();
    
    if (serviceRoleError) {
      console.error('❌ Error creating business plan with service role:', serviceRoleError.message);
      console.error('❌ Error code:', serviceRoleError.code);
      console.error('❌ Error details:', serviceRoleError.details);
    } else {
      console.log('✅ Business plan created successfully with service role');
      console.log('📋 Created plan ID:', serviceRolePlan[0].id);
      
      // 6. Check client-side code
      console.log('6️⃣ Checking client-side code...');
      console.log('⚠️ Client-side issues to check manually:');
      console.log('1. Ensure user is authenticated before saving');
      console.log('2. Check that user_id is correctly set to auth.user.id');
      console.log('3. Verify all required fields are provided');
      console.log('4. Check browser console for errors during save');
      console.log('5. Ensure createSupabaseBusinessPlan is imported correctly');
      
      // 7. Provide recommendations
      console.log('7️⃣ Recommendations:');
      console.log('1. Add more detailed error logging in the saveBusinessPlan function');
      console.log('2. Implement retry logic for transient errors');
      console.log('3. Add validation before saving to ensure all required fields are present');
      console.log('4. Consider adding a status indicator to show save progress');
      console.log('5. Add a debug mode to log detailed information during save');
    }
    
    console.log('✅ Diagnosis completed');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Helper function to create the business_plans table
async function createBusinessPlansTable() {
  try {
    const { error } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS public.business_plans (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id),
          title TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          business_idea TEXT NOT NULL,
          location TEXT NOT NULL,
          category TEXT NOT NULL,
          sections JSONB NOT NULL DEFAULT '[]'::JSONB,
          details JSONB NOT NULL DEFAULT '{}'::JSONB,
          metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
          status TEXT NOT NULL DEFAULT 'draft',
          version INTEGER NOT NULL DEFAULT 1,
          is_public BOOLEAN NOT NULL DEFAULT FALSE,
          tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
          target_market TEXT,
          solution TEXT,
          business_stage TEXT,
          team_size TEXT,
          revenue_model TEXT,
          funding_needs TEXT,
          growth_goals TEXT,
          marketing_strategy TEXT,
          key_resources TEXT,
          additional_notes TEXT
        );
      `
    });
    
    if (error) {
      console.error('❌ Error creating business_plans table:', error.message);
      return false;
    }
    
    console.log('✅ business_plans table created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating business_plans table:', error.message);
    return false;
  }
}

// Helper function to add a missing column
async function addMissingColumn(columnName) {
  try {
    let query;
    
    switch (columnName) {
      case 'id':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`;
        break;
      case 'user_id':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL REFERENCES auth.users(id)`;
        break;
      case 'title':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Untitled Business Plan'`;
        break;
      case 'business_idea':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS business_idea TEXT NOT NULL DEFAULT 'No business idea provided'`;
        break;
      case 'location':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT 'No location provided'`;
        break;
      case 'category':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'New Company'`;
        break;
      case 'sections':
        query = `ALTER TABLE public.business_plans ADD COLUMN IF NOT EXISTS sections JSONB NOT NULL DEFAULT '[]'::JSONB`;
        break;
      default:
        console.log(`⚠️ No definition for column ${columnName}`);
        return false;
    }
    
    const { error } = await supabase.rpc('execute_sql', { query });
    
    if (error) {
      console.error(`❌ Error adding column ${columnName}:`, error.message);
      return false;
    }
    
    console.log(`✅ Column ${columnName} added successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error adding column ${columnName}:`, error.message);
    return false;
  }
}

// Helper function to create RLS policies
async function createRLSPolicies() {
  try {
    const policies = [
      `
        CREATE POLICY "Users can view their own business plans"
        ON public.business_plans FOR SELECT
        USING (auth.uid() = user_id)
      `,
      `
        CREATE POLICY "Users can create their own business plans"
        ON public.business_plans FOR INSERT
        WITH CHECK (auth.uid() = user_id)
      `,
      `
        CREATE POLICY "Users can update their own business plans"
        ON public.business_plans FOR UPDATE
        USING (auth.uid() = user_id)
      `,
      `
        CREATE POLICY "Users can delete their own business plans"
        ON public.business_plans FOR DELETE
        USING (auth.uid() = user_id)
      `
    ];
    
    for (const policy of policies) {
      const { error } = await supabase.rpc('execute_sql', { query: policy });
      
      if (error && !error.message.includes('already exists')) {
        console.error('❌ Error creating policy:', error.message);
      } else {
        console.log('✅ Policy created or already exists');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error creating RLS policies:', error.message);
    return false;
  }
}

// Helper function to enable RLS
async function enableRLS() {
  try {
    const { error } = await supabase.rpc('execute_sql', {
      query: `ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY`
    });
    
    if (error) {
      console.error('❌ Error enabling RLS:', error.message);
      return false;
    }
    
    console.log('✅ RLS enabled successfully');
    return true;
  } catch (error) {
    console.error('❌ Error enabling RLS:', error.message);
    return false;
  }
}

// Run the fix process
fixBusinessPlanSave(); 