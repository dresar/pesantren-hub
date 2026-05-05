import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log("Connecting and executing seed...");
        const sql = fs.readFileSync('./dumppy/dokumentasi_seed.sql', 'utf-8');
        await pool.query(sql);
        console.log("Seeds executed successfully.");
    } catch (e) {
        console.error("Error executing seed:", e);
    } finally {
        await pool.end();
        process.exit(0);
    }
}
run();
