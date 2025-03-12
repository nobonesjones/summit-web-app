// This script provides the command to list all users in Convex using the Convex CLI

console.log(`
To list all users in Convex, run the following command:

npx convex run users:listUsers

This will return all users stored in the Convex database.
`);

// Execute the command directly
const { execSync } = require('child_process');

try {
  console.log('Executing the command...\n');
  const output = execSync('npx convex run users:listUsers', { encoding: 'utf8' });
  console.log('Users in Convex:');
  console.log(output);
} catch (error) {
  console.error('Error executing command:', error.message);
  console.log('\nPlease run the command manually.');
} 