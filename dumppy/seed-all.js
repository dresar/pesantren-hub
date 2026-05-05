import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const seeds = [
  'kmi_migrate.sql',      // CREATE KMI tables (aman, tidak hapus data existing)
  'cleanup_unused_tables.sql',
  'raudhatussalam_settings.sql',
  'hero_sections.sql',
  'sejarah_seed.sql',
  'founders_detail.sql',
  'program_pendidikan_reset.sql',
  'public_seed.sql',
  'pengajar_seed.sql',
  'organisasi_seed.sql',
  'dokumentasi_seed.sql',
  'blog_berita_seed.sql',
  'artikel_seed.sql',
  'jurnal_seed.sql',
  'registration_flow.sql',
  'statistics_reset.sql',
  'kmi_lms_seed.sql',     // KMI master data (mapel, jenjang, kalender, dll.)
];


async function runSeeds() {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting database seeding process...');
    
    for (const seedFile of seeds) {
      const filePath = path.join(__dirname, seedFile);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Warning: Seed file not found: ${seedFile}`);
        continue;
      }
      
      console.log(`⏳ Executing ${seedFile}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split by semicolon but watch out for semicolons inside strings or dollar-quoted blocks
      // For simplicity, we execute the whole block if it's not too huge, 
      // or we can use a more robust parser. Since these are seeds, usually they are 1 file = 1 block or simple inserts.
      await client.query(sql);
      console.log(`✅ Finished ${seedFile}`);
    }
    
    console.log('✨ All seeds executed successfully!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds();
