/**
 * This script provides instructions for setting up Supabase webhooks
 * to sync users to Convex when they sign up or update their profile.
 */

console.log(`
=== Setting Up Supabase Auth Webhooks ===

To set up Supabase Auth webhooks to sync users to Convex, follow these steps:

1. Go to the Supabase Dashboard: https://app.supabase.com/
2. Select your project
3. Navigate to Database > Webhooks
4. Click "Create a new webhook"
5. Configure the webhook:
   - Name: auth-events
   - Table: auth.users
   - Events: INSERT, UPDATE (select both)
   - URL: https://your-app-url.com/api/webhooks/supabase-auth
   - HTTP Method: POST
   - HTTP Headers (optional):
     - x-webhook-signature: your-secret-key

6. Click "Create webhook"

This webhook will trigger whenever a user signs up or updates their profile in Supabase Auth.
The webhook will send the user data to your Next.js API route, which will create or update
the user in Convex.

=== Alternative: Database Triggers ===

If you prefer to use database triggers instead of webhooks, you can create a function
that runs when a user is created or updated in the auth.users table:

1. Go to the Supabase Dashboard: https://app.supabase.com/
2. Select your project
3. Navigate to SQL Editor
4. Create a new query with the following SQL:

CREATE OR REPLACE FUNCTION public.handle_auth_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Make an HTTP request to your webhook endpoint
  PERFORM
    net.http_post(
      'https://your-app-url.com/api/webhooks/supabase-auth',
      jsonb_build_object(
        'type', TG_OP,
        'record', row_to_json(NEW)
      ),
      jsonb_build_object(
        'Content-Type', 'application/json',
        'x-webhook-signature', 'your-secret-key'
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger for INSERT operations
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_changes();

-- Create a trigger for UPDATE operations
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_changes();

5. Run the query

=== Testing the Webhook ===

To test if the webhook is working:

1. Sign up a new user in your application
2. Check the server logs for messages like "Syncing user to Convex" and "User successfully created in Convex"
3. Verify in the Convex dashboard that the user was created in the 'users' table

=== Troubleshooting ===

If users are not being added to Convex, check the following:

1. Ensure your Supabase webhook is properly configured and receiving events
2. Verify that the Convex URL and API keys are correctly set in your environment variables
3. Check the server logs for any errors during the user creation process
4. Make sure the Convex schema has the correct structure for the 'users' table
5. Test the UserSync component by signing out and signing back in
`); 