import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// For use in a Node.js environment
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// For use in a serverless environment
export const createClient = () => {
  const client = postgres(process.env.DATABASE_URL!);
  return drizzle(client, { schema });
}; 