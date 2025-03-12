// Script to list all users in Convex
import { ConvexHttpClient } from "convex/browser";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get the Convex URL from environment variables
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not defined in .env.local");
  process.exit(1);
}

// Create a Convex HTTP client
const convex = new ConvexHttpClient(CONVEX_URL);

async function listConvexUsers() {
  try {
    console.log("Listing all users in Convex...");
    
    // Import the API dynamically
    const apiModule = await import("../convex/_generated/api.js");
    const api = apiModule.default;
    
    // Query all users in Convex
    const users = await convex.query(api.users.listUsers);
    
    if (!users || users.length === 0) {
      console.log("No users found in Convex");
      process.exit(0);
    }
    
    console.log(`Found ${users.length} users in Convex:`);
    
    // Print each user
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(JSON.stringify(user, null, 2));
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error listing users in Convex:", error);
    process.exit(1);
  }
}

// Run the function
listConvexUsers(); 