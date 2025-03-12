# Supabase Auth Webhook for Convex Integration

This Edge Function synchronizes user data between Supabase Auth and Convex. When a user signs up or logs in to your application, this function will:

1. Create or update a profile record in Supabase
2. Forward the event to your application's webhook endpoint
3. The application webhook will then create or update the user in Convex

## Setup Instructions

### 1. Deploy the Edge Function

```bash
supabase functions deploy auth-webhook --no-verify-jwt
```

### 2. Set up environment variables

In the Supabase dashboard, add the following secrets to your Edge Function:

```bash
supabase secrets set APP_WEBHOOK_URL=https://your-app-url.com/api/webhooks/auth
```

### 3. Enable the Auth Webhook in Supabase

1. Go to the Supabase dashboard
2. Navigate to Authentication > Providers > Webhooks
3. Enable the webhook for the following events:
   - `auth.signup`
   - `auth.login`
4. Set the webhook URL to your Edge Function URL:
   ```
   https://[YOUR_PROJECT_REF].supabase.co/functions/v1/auth-webhook
   ```

### 4. Set up the application webhook endpoint

Make sure your application has a webhook endpoint at `/api/webhooks/auth` that can receive and process the events from this Edge Function.

## Testing

You can test the webhook by signing up a new user in your application. The Edge Function logs will show the event being processed, and you should see the user being created in both Supabase and Convex.

## Troubleshooting

- Check the Edge Function logs in the Supabase dashboard
- Verify that the `APP_WEBHOOK_URL` is correct and accessible
- Ensure your application's webhook endpoint is properly handling the events

## Security Considerations

In a production environment, you should:

1. Add a secret key to the webhook requests for verification
2. Implement proper error handling and retries
3. Consider adding rate limiting to prevent abuse 