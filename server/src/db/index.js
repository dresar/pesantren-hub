import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config();
const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
    max: 10
});
export const db = drizzle(client, { schema });
