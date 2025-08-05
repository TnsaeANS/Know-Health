import { Pool } from "pg";

if (!process.env.POSTGRES_URL) {
  console.warn(
    "POSTGRES_URL environment variable is not set. Database features will not work."
  );
}

export const pool = process.env.POSTGRES_URL
  ? new Pool({
      connectionString: process.env.POSTGRES_URL,
    })
  : null;
