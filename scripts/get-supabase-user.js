// Script to get the current user from Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get the Supabase URL and key from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in .env.local");
  process.exit(1);
}

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getCurrentUser() {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      process.exit(1);
    }
    
    if (!session) {
      console.log("No active session found. Please sign in first.");
      process.exit(0);
    }
    
    // Get the user from the session
    const { user } = session;
    
    console.log("Current user:", {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    });
    
    // Get the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error getting profile:", profileError);
    } else {
      console.log("User profile:", profile);
    }
    
    // Print the user ID for easy copying
    console.log("\nUser ID for Convex scripts:");
    console.log(user.id);
    
    process.exit(0);
  } catch (error) {
    console.error("Error getting current user:", error);
    process.exit(1);
  }
}

// Run the function
getCurrentUser(); 