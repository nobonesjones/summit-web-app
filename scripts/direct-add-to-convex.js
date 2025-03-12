// This is a template for a mutation to add a user to Convex
// To use this, copy the JSON below and run:
// npx convex run users:createUser --arguments '{...}'

/*
Example command:

npx convex run users:createUser --arguments '{
  "tokenIdentifier": "YOUR_USER_ID",
  "userId": "YOUR_USER_ID",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2023-03-09T00:00:00.000Z"
}'
*/

console.log(`
To add a user to Convex, run the following command:

npx convex run users:createUser --arguments '{
  "tokenIdentifier": "YOUR_USER_ID",
  "userId": "YOUR_USER_ID",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "${new Date().toISOString()}"
}'

Replace YOUR_USER_ID with the Supabase user ID, and update the email and name as needed.
`);

// If you have a specific user ID, you can also run:
if (process.argv[2]) {
  const userId = process.argv[2];
  const email = process.argv[3] || 'user@example.com';
  const name = process.argv[4] || email.split('@')[0];
  
  console.log(`
For the provided user ID (${userId}), run:

npx convex run users:createUser --arguments '{
  "tokenIdentifier": "${userId}",
  "userId": "${userId}",
  "email": "${email}",
  "name": "${name}",
  "createdAt": "${new Date().toISOString()}"
}'
  `);
} 