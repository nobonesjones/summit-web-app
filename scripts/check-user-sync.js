// This script checks if the user sync is working by logging the current user in Supabase
// and checking if they exist in Convex.

console.log(`
To check if your user is properly synced between Supabase and Convex, follow these steps:

1. Make sure you're signed in to your application
2. Open your browser's developer tools (F12 or right-click and select "Inspect")
3. Go to the "Console" tab
4. Look for logs that say "Syncing user to Convex" and "User successfully synced to Convex"
5. If you don't see these logs, try refreshing the page or signing out and back in

You can also check the Convex dashboard to see if your user exists:
1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to the "Data" tab
4. Select the "users" table
5. Look for a user with your email address or user ID

If your user doesn't exist in Convex, try the following:
1. Sign out and sign back in to your application
2. Check the console for any errors during the sync process
3. Make sure the UserSync component is properly included in your application
4. Verify that your Convex URL is correctly set in your environment variables
`);

// Instructions for manually adding a user to Convex
console.log(`
If you need to manually add a user to Convex, you can use the following steps:

1. Get your Supabase user ID by running this code in your browser console:
   const { data } = await supabase.auth.getSession();
   console.log('User ID:', data.session?.user?.id);

2. Use the Convex dashboard to add a new document to the "users" table with the following fields:
   - tokenIdentifier: Your Supabase user ID
   - userId: Your Supabase user ID
   - email: Your email address
   - name: Your name
   - createdAt: Current date in ISO format (e.g., "${new Date().toISOString()}")

3. Click "Save" to add the user to Convex
`); 