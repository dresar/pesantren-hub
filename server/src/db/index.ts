import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is MISSING.');
  console.info('Wait... proceeding initialization anyway (this might be a build process or environment delay).');
}

// Optimization for serverless: force fetch for connection
neonConfig.fetchConnectionCache = true;

const client = new Pool({
  connectionString: process.env.DATABASE_URL || '', // Fallback to empty string to avoid crash during export
  ssl: {
    rejectUnauthorized: false
  },
  // Serverless: gunakan pool kecil. Scaling horizontal terjadi di level function,
  // bukan di level koneksi. max: 5 sudah lebih dari cukup per instance.
  max: 5,
  // Timeout untuk menghindari hanging connection di cold start
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(client, { schema });