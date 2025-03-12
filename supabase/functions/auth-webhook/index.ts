// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client with the admin key
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Your application's webhook URL
const WEBHOOK_URL = Deno.env.get("APP_WEBHOOK_URL") ?? "";

serve(async (req) => {
  // This function can only be called by Supabase Auth
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the event data from the request
    const payload = await req.json();
    console.log("Auth webhook received event:", payload.type);

    // Handle different event types
    if (payload.type === "auth.signup" || payload.type === "auth.login") {
      const { user } = payload;
      
      if (!user) {
        throw new Error("No user data in payload");
      }

      // Create or update profile in Supabase
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          updated_at: new Date().toISOString(),
          // If this is a new user, set created_at
          ...(payload.type === "auth.signup" ? { created_at: new Date().toISOString() } : {}),
        }, { onConflict: "id" });

      if (profileError) {
        console.error("Error upserting profile:", profileError);
      }

      // Forward the event to our application webhook to sync with Convex
      if (WEBHOOK_URL) {
        const webhookPayload = {
          type: payload.type === "auth.signup" ? "INSERT" : "UPDATE",
          record: user,
        };

        const webhookResponse = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add a signature or secret here for security
          },
          body: JSON.stringify(webhookPayload),
        });

        if (!webhookResponse.ok) {
          console.error("Error forwarding to app webhook:", await webhookResponse.text());
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing auth webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/auth-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
