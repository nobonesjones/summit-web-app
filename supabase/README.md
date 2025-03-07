# Supabase Setup for Summit Mini-Apps Platform

This directory contains the necessary files and instructions to set up Supabase for the Summit Mini-Apps Platform.

## Initial Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Setup

1. Navigate to the SQL Editor in your Supabase dashboard
2. Run the SQL script in `migrations/profiles.sql` to create the profiles table and set up the necessary triggers and policies

## Authentication Setup

1. Navigate to the Authentication settings in your Supabase dashboard
2. Enable the following providers:
   - Email (with or without password)
   - Google
   - GitHub
3. Configure the redirect URLs:
   - Site URL: `https://your-site-url.com`
   - Redirect URLs: 
     - `https://your-site-url.com/auth/callback`
     - `http://localhost:3000/auth/callback` (for local development)
4. Configure email templates for:
   - Confirmation
   - Invitation
   - Magic Link
   - Reset Password

## Webhook Setup (Optional)

If you want to use webhooks for additional functionality:

1. Navigate to the Database > Webhooks section in your Supabase dashboard
2. Create a new webhook with the following settings:
   - Name: `auth-events`
   - Table: `auth.users`
   - Events: `INSERT`, `UPDATE`, `DELETE`
   - URL: `https://your-site-url.com/api/webhooks/auth`
   - HTTP Method: `POST`
   - Enable signing (recommended)

## Row Level Security (RLS)

The SQL script sets up Row Level Security policies that:

1. Allow users to view their own profile
2. Allow users to update their own profile

## User Management

The SQL script also sets up a trigger that automatically creates a profile record when a new user signs up.

## Testing

To test the authentication flow:

1. Run your Next.js application locally
2. Navigate to `/sign-up` to create a new account
3. Check that you can sign in at `/sign-in`
4. Verify that you can access protected routes like `/dashboard` and `/user-profile`
5. Test updating your profile information 