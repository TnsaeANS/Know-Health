
import { Pool } from 'pg';

if (!process.env.POSTGRES_URL) {
  // This check is primarily for the build process, as client-side env vars aren't available here.
  // The server-side actions/pages will throw the error if the variable is missing at runtime.
  console.warn('POSTGRES_URL environment variable is not set. Database features will not work.');
}

// The pool will only be created and used in server-side code.
export const pool = process.env.POSTGRES_URL ? new Pool({
  connectionString: process.env.POSTGRES_URL,
}) : null;
