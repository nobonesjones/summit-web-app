#!/usr/bin/env node

/**
 * This script creates the execute_sql function in the database
 * Run with: node scripts/create-execute-sql-function.js
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

async function createExecuteSqlFunction() {
  try {
    console.log('🔍 Creating execute_sql function...');
    
    // Create the function using raw SQL
    const { error } = await supabase.rpc('pg_query', {
      query: `
        CREATE OR REPLACE FUNCTION public.execute_sql(query text)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE query INTO result;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          RETURN jsonb_build_object(
            'error', SQLERRM,
            'detail', SQLSTATE
          );
        END;
        $$;
        
        -- Grant execute permission to authenticated users
        GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
      `
    });
    
    if (error) {
      // If pg_query doesn't exist, try direct SQL
      console.log('❌ pg_query function not found. Trying direct SQL...');
      
      // Try to create the function using direct SQL
      const { error: directError } = await supabase.from('_direct_sql').select('*').eq('query', `
        CREATE OR REPLACE FUNCTION public.execute_sql(query text)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE query INTO result;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          RETURN jsonb_build_object(
            'error', SQLERRM,
            'detail', SQLSTATE
          );
        END;
        $$;
        
        -- Grant execute permission to authenticated users
        GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
      `);
      
      if (directError) {
        console.error('❌ Error creating execute_sql function:', directError.message);
        
        // Create a fallback function that can be used for testing
        console.log('🔧 Creating fallback pg_query function...');
        
        const { error: fallbackError } = await supabase.from('_fallback_sql').select('*').eq('query', `
          CREATE OR REPLACE FUNCTION public.pg_query(query text)
          RETURNS JSONB
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            result JSONB;
          BEGIN
            EXECUTE query INTO result;
            RETURN result;
          EXCEPTION WHEN OTHERS THEN
            RETURN jsonb_build_object(
              'error', SQLERRM,
              'detail', SQLSTATE
            );
          END;
          $$;
          
          -- Grant execute permission to authenticated users
          GRANT EXECUTE ON FUNCTION public.pg_query(text) TO authenticated;
          GRANT EXECUTE ON FUNCTION public.pg_query(text) TO service_role;
        `);
        
        if (fallbackError) {
          console.error('❌ Error creating fallback function:', fallbackError.message);
          console.log('⚠️ You may need to create the function manually in the Supabase dashboard.');
          console.log('⚠️ Go to: https://app.supabase.com/project/_/sql/new');
          console.log('⚠️ Run the following SQL:');
          console.log(`
            CREATE OR REPLACE FUNCTION public.execute_sql(query text)
            RETURNS JSONB
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            DECLARE
              result JSONB;
            BEGIN
              EXECUTE query INTO result;
              RETURN result;
            EXCEPTION WHEN OTHERS THEN
              RETURN jsonb_build_object(
                'error', SQLERRM,
                'detail', SQLSTATE
              );
            END;
            $$;
            
            -- Grant execute permission to authenticated users
            GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
            GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
          `);
          return;
        }
        
        console.log('✅ Fallback function created successfully');
        return;
      }
      
      console.log('✅ Function created successfully using direct SQL');
      return;
    }
    
    console.log('✅ Function created successfully');
    
    // Test the function
    console.log('🔍 Testing execute_sql function...');
    const { data: testData, error: testError } = await supabase.rpc('execute_sql', {
      query: 'SELECT current_database() as db_name'
    });
    
    if (testError) {
      console.error('❌ Error testing execute_sql function:', testError.message);
      return;
    }
    
    console.log('✅ Function test successful');
    console.log('📋 Test result:', testData);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the function creation process
createExecuteSqlFunction(); 