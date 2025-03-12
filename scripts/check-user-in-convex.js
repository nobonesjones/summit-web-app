// Script to check if a user exists in Convex
const { ConvexHttpClient } = require("convex/browser");
require('dotenv').config({ path: '.env.local' });

// Get the Convex URL from environment variables
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("NEXT_PUBLIC_CONVEX_URL is not defined in .env.local");
  process.exit(1);
}

// Create a Convex HTTP client
const convex = new ConvexHttpClient(CONVEX_URL);

// Get the user ID from command line arguments
const userId = process.argv[2];
if (!userId) {
  console.error("Please provide a user ID as an argument");
  console.error("Usage: node scripts/check-user-in-convex.js <user-id>");
  process.exit(1);
}

async function checkUserInConvex() {
  try {
    console.log(`Checking if user exists in Convex: ${userId}`);
    
    // Import the API dynamically
    const { api } = await import("../convex/_generated/api.js");
    
    // Query the user in Convex
    const user = await convex.query(api.users.getUserByToken, {
      tokenIdentifier: userId,
    });
    
    if (user) {
      console.log("User found in Convex:", user);
    } else {
      console.log("User not found in Convex");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking user in Convex:", error);
    process.exit(1);
  }
}

// Run the function
checkUserInConvex(); 