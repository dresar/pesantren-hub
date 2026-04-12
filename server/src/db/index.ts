import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// neonConfig.fetchConnectionCache is now true by default in the latest version

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  // Serverless: gunakan pool kecil. Scaling horizontal terjadi di level function,
  // bukan di level koneksi. max: 5 sudah lebih dari cukup per instance.
  max: 5,
  // Timeout untuk menghindari hanging connection di cold start
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(client, { schema });