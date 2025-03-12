export default {
  providers: [
    {
      domain: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co",
      applicationID: "convex",
    },
  ]
};