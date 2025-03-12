// Script to directly add a user to Convex
import { ConvexHttpClient } from "convex/browser";
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get the Convex URL from environment variables
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not defined in .env.local");
  process.exit(1);
}

// Get the Supabase URL and key from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local");
  process.exit(1);
}

// Create a Convex HTTP client
const convex = new ConvexHttpClient(CONVEX_URL);

// Create a Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Get the user ID from command line arguments
const userId = process.argv[2];
if (!userId) {
  console.error("Please provide a user ID as an argument");
  console.error("Usage: node scripts/add-user-to-convex.mjs <user-id>");
  process.exit(1);
}

async function addUserToConvex() {
  try {
    console.log(`Getting user from Supabase: ${userId}`);
    
    // Get the user from Supabase
    const { data: user, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error) {
      console.error("Error getting user from Supabase:", error);
      process.exit(1);
    }
    
    if (!user) {
      console.error("User not found in Supabase");
      process.exit(1);
    }
    
    console.log("User found in Supabase:", {
      id: user.user.id,
      email: user.user.email,
      created_at: user.user.created_at,
    });
    
    // Get the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Error getting profile:", profileError);
    } else if (profile) {
      console.log("User profile:", profile);
    }
    
    console.log(`Adding user to Convex: ${user.user.id}`);
    
    // Import the API dynamically
    const apiModule = await import("../convex/_generated/api.js");
    const api = apiModule.default;
    
    // Create the user in Convex
    const result = await convex.mutation(api.users.createUser, {
      tokenIdentifier: user.user.id,
      userId: user.user.id,
      email: user.user.email || '',
      name: profile?.full_name || user.user.email?.split('@')[0] || '',
      createdAt: new Date().toISOString(),
    });
    
    console.log("User successfully added to Convex with ID:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error adding user to Convex:", error);
    process.exit(1);
  }
}

// Run the function
addUserToConvex(); 