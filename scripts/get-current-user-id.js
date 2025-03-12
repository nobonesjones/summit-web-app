// This script gets the current user ID from Supabase
// It uses the browser localStorage to get the session

// Function to extract the user ID from localStorage
function getCurrentUserId() {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.error("This script must be run in a browser environment");
      return null;
    }
    
    // Get the Supabase session from localStorage
    const supabaseSession = localStorage.getItem('supabase.auth.token');
    
    if (!supabaseSession) {
      console.error("No Supabase session found in localStorage. Please sign in first.");
      return null;
    }
    
    // Parse the session
    const session = JSON.parse(supabaseSession);
    
    // Extract the user ID
    const userId = session?.currentSession?.user?.id;
    
    if (!userId) {
      console.error("Could not extract user ID from session");
      return null;
    }
    
    return userId;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

// Instructions for the user
console.log(`
To get your current user ID from Supabase, follow these steps:

1. Open your browser's developer tools (F12 or right-click and select "Inspect")
2. Go to the "Console" tab
3. Paste and run the following code:

const supabaseSession = localStorage.getItem('supabase.auth.token');
if (supabaseSession) {
  const session = JSON.parse(supabaseSession);
  const userId = session?.currentSession?.user?.id;
  console.log('Your user ID is:', userId);
} else {
  console.log('No Supabase session found. Please sign in first.');
}

4. Copy the user ID that is printed in the console
5. Use this ID to add the user to Convex:

node scripts/generate-user-json.js YOUR_USER_ID your@email.com "Your Name"

`); 