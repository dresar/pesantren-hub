import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env dari folder yang sama
dotenv.config({ path: path.join(__dirname, ".env") });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
