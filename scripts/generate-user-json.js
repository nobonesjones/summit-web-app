// This script generates the JSON for a user to be added to Convex
// You can copy this JSON and paste it into the Convex dashboard

// Get the user ID from command line arguments
const userId = process.argv[2];
if (!userId) {
  console.error("Please provide a user ID as an argument");
  console.error("Usage: node scripts/generate-user-json.js <user-id> [email] [name]");
  process.exit(1);
}

// Get the email from command line arguments
const email = process.argv[3] || 'user@example.com';

// Get the name from command line arguments
const name = process.argv[4] || email.split('@')[0];

// Generate the JSON
const user = {
  tokenIdentifier: userId,
  userId: userId,
  email: email,
  name: name,
  createdAt: new Date().toISOString(),
};

console.log("User JSON for Convex:");
console.log(JSON.stringify(user, null, 2));
console.log("\nCopy this JSON and paste it into the Convex dashboard to add a user.");
console.log("1. Go to https://dashboard.convex.dev");
console.log("2. Select your project");
console.log("3. Go to the 'Data' tab");
console.log("4. Select the 'users' table");
console.log("5. Click 'Add Document'");
console.log("6. Paste the JSON above");
console.log("7. Click 'Save'"); 