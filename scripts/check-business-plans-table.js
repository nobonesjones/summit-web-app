#!/usr/bin/env node

/**
 * This script checks if the business_plans table exists in Supabase and creates it if it doesn't
 * Run with: node scripts/check-business-plans-table.js
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

async function checkAndCreateTable() {
  try {
    console.log('🔍 Checking if business_plans table exists...');
    
    // Try to query the business_plans table
    const { data, error } = await supabase
      .from('business_plans')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.log('⚠️ business_plans table does not exist');
        await createBusinessPlansTable();
      } else {
        console.error('❌ Error checking business_plans table:', error.message);
      }
    } else {
      console.log('✅ business_plans table exists');
      console.log('📋 Sample data:', data);
      
      // Create a test business plan
      await createTestBusinessPlan();
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function createBusinessPlansTable() {
  console.log('🔧 Creating business_plans table...');
  
  try {
    // Create the table using SQL
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.business_plans (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) NOT NULL,
          title TEXT NOT NULL,
          business_idea TEXT NOT NULL,
          location TEXT NOT NULL,
          category TEXT NOT NULL,
          sections JSONB,
          details JSONB,
          metadata JSONB,
          status TEXT DEFAULT 'draft',
          version INTEGER DEFAULT 1,
          is_public BOOLEAN DEFAULT false,
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add RLS policies
        ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
        
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
        
        -- Create indexes
        CREATE INDEX idx_business_plans_user_id ON public.business_plans(user_id);
        CREATE INDEX idx_business_plans_created_at ON public.business_plans(created_at);
      `
    });
    
    if (error) {
      if (error.message.includes('function public.execute_sql(text) does not exist')) {
        console.log('⚠️ execute_sql function does not exist');
        console.log('🔧 Creating execute_sql function...');
        
        // Create the function using direct SQL
        const { error: sqlError } = await supabase.rpc('create_execute_sql_function', {});
        
        if (sqlError) {
          console.error('❌ Error creating execute_sql function:', sqlError.message);
          console.log('⚠️ You need to create this function manually in the Supabase SQL editor:');
          console.log(`
            CREATE OR REPLACE FUNCTION public.execute_sql(sql_query text)
            RETURNS void
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
              EXECUTE sql_query;
            END;
            $$;
          `);
          
          console.log('⚠️ You also need to create the business_plans table manually:');
          console.log(`
            CREATE TABLE IF NOT EXISTS public.business_plans (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES auth.users(id) NOT NULL,
              title TEXT NOT NULL,
              business_idea TEXT NOT NULL,
              location TEXT NOT NULL,
              category TEXT NOT NULL,
              sections JSONB,
              details JSONB,
              metadata JSONB,
              status TEXT DEFAULT 'draft',
              version INTEGER DEFAULT 1,
              is_public BOOLEAN DEFAULT false,
              tags TEXT[] DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            
            -- Add RLS policies
            ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;
            
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
            
            -- Create indexes
            CREATE INDEX idx_business_plans_user_id ON public.business_plans(user_id);
            CREATE INDEX idx_business_plans_created_at ON public.business_plans(created_at);
          `);
        } else {
          console.log('✅ execute_sql function created successfully');
          // Try creating the table again
          await createBusinessPlansTable();
        }
      } else {
        console.error('❌ Error creating business_plans table:', error.message);
      }
    } else {
      console.log('✅ business_plans table created successfully');
      
      // Create a test business plan
      await createTestBusinessPlan();
    }
  } catch (error) {
    console.error('❌ Error creating business_plans table:', error.message);
  }
}

async function createTestBusinessPlan() {
  console.log('🔧 Creating a test business plan...');
  
  try {
    // Get the first user from the auth.users table
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    if (!users || users.users.length === 0) {
      console.log('⚠️ No users found. Cannot create test business plan.');
      return;
    }
    
    const userId = users.users[0].id;
    console.log(`📋 Using user ID: ${userId}`);
    
    // Create a test business plan
    const { data, error } = await supabase
      .from('business_plans')
      .insert([
        {
          user_id: userId,
          title: 'Test Business Plan',
          business_idea: 'A test business idea',
          location: 'Test Location',
          category: 'New Company',
          sections: [
            {
              title: 'Executive Summary',
              content: 'This is a test executive summary.'
            },
            {
              title: 'Market Analysis',
              content: 'This is a test market analysis.'
            }
          ]
        }
      ])
      .select();
    
    if (error) {
      console.error('❌ Error creating test business plan:', error.message);
    } else {
      console.log('✅ Test business plan created successfully:', data);
    }
  } catch (error) {
    console.error('❌ Error creating test business plan:', error.message);
  }
}

// Run the check
checkAndCreateTable(); 