// Script to directly add a user to Convex
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
  console.error("Usage: node scripts/add-user-to-convex.js <user-id>");
  process.exit(1);
}

// Get the email from command line arguments
const email = process.argv[3];
if (!email) {
  console.error("Please provide an email as an argument");
  console.error("Usage: node scripts/add-user-to-convex.js <user-id> <email>");
  process.exit(1);
}

async function addUserToConvex() {
  try {
    console.log(`Adding user to Convex: ${userId} (${email})`);
    
    // Import the API dynamically
    const { api } = await import("../convex/_generated/api.js");
    
    // Create the user in Convex
    const result = await convex.mutation(api.users.createUser, {
      tokenIdentifier: userId,
      userId: userId,
      email: email,
      name: email.split('@')[0],
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