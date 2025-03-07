import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

// Ensure we have the Supabase URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseHost = supabaseUrl.replace("https://", "");

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: supabaseHost,
    database: "postgres",
    user: "postgres",
    password: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    ssl: true,
  },
} satisfies Config;
