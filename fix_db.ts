import { db } from './server/src/db/index';
import { sql } from 'drizzle-orm';

async function run() {
    try {
        console.log('Updating popup_start_date...');
        await db.execute(sql`ALTER TABLE blog_pengumuman ALTER COLUMN popup_start_date TYPE TIMESTAMP USING NULL;`);
    } catch(e) {
        console.log('Skipping start_date error:', e.message);
    }

    try {
        console.log('Updating popup_end_date...');
        await db.execute(sql`ALTER TABLE blog_pengumuman ALTER COLUMN popup_end_date TYPE TIMESTAMP USING NULL;`);
    } catch(e) {
         console.log('Skipping end_date error:', e.message);
    }
    
    console.log('done');
    process.exit(0);
}

run();
