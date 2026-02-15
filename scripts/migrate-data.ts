import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as mysqlSchema from '../server/db/schema.mysql';
import * as pgSchema from '../server/db/schema';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

dotenv.config();

const migrate = async () => {
  console.log('Starting migration...');

  // 1. Connect to MySQL
  const mysqlConnection = await mysql.createConnection({
    uri: process.env.MYSQL_DATABASE_URL,
  });
  const mysqlDb = drizzleMysql(mysqlConnection, { schema: mysqlSchema, mode: 'default' });
  console.log('Connected to MySQL');

  // 2. Connect to Postgres
  const pgClient = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  const pgDb = drizzlePg(pgClient, { schema: pgSchema });
  console.log('Connected to Postgres');

  // Helper to migrate a table
  const migrateTable = async (tableName: string, mysqlTable: any, pgTable: any, resetSeq = true) => {
    console.log(`Migrating ${tableName}...`);
    const data = await mysqlDb.select().from(mysqlTable);
    
    if (data.length > 0) {
      // Chunk insert to avoid hitting parameter limits
      const chunkSize = 1000;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        
        // Data transformation if needed (e.g. handling dates or booleans if raw types differ)
        // Drizzle usually handles this, but let's be safe with dates if they are strings
        const sanitizedChunk = chunk.map(row => {
            const newRow = { ...row };
            // Postgres doesn't like undefined for nullable columns sometimes, prefer null
            Object.keys(newRow).forEach(key => {
                if (newRow[key] === undefined) newRow[key] = null;
            });
            return newRow;
        });

        await pgDb.insert(pgTable).values(sanitizedChunk).onConflictDoNothing(); // Prevent duplicates if re-run
      }
      console.log(`Migrated ${data.length} rows for ${tableName}`);

      if (resetSeq) {
        try {
            // Reset sequence
            await pgDb.execute(sql.raw(`SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), (SELECT MAX(id) FROM ${tableName}));`));
            console.log(`Sequence reset for ${tableName}`);
        } catch (e) {
            console.warn(`Could not reset sequence for ${tableName} (might not have ID or serial):`, e.message);
        }
      }
    } else {
      console.log(`No data in ${tableName}`);
    }
  };

  try {
    // 3. Migrate tables in order
    // Order based on dependencies
    
    // Independent tables
    await migrateTable('users_user', mysqlSchema.users, pgSchema.users);
    await migrateTable('blog_category', mysqlSchema.blogCategories, pgSchema.blogCategories);
    await migrateTable('blog_tag', mysqlSchema.blogTags, pgSchema.blogTags);
    await migrateTable('core_whatsapptemplatekategori', mysqlSchema.whatsappTemplateCategories, pgSchema.whatsappTemplateCategories);
    
    // Core/Website tables
    await migrateTable('core_websitesettings', mysqlSchema.websiteSettings, pgSchema.websiteSettings);
    await migrateTable('core_herosection', mysqlSchema.heroSection, pgSchema.heroSection);
    await migrateTable('core_registration_flow', mysqlSchema.websiteRegistrationFlow, pgSchema.websiteRegistrationFlow);
    await migrateTable('core_sejarahtimeline', mysqlSchema.sejarahTimeline, pgSchema.sejarahTimeline);
    await migrateTable('core_visimisi', mysqlSchema.visiMisi, pgSchema.visiMisi);
    await migrateTable('core_programpendidikan', mysqlSchema.programPendidikan, pgSchema.programPendidikan);
    await migrateTable('core_fasilitas', mysqlSchema.fasilitas, pgSchema.fasilitas);
    await migrateTable('core_ekstrakurikuler', mysqlSchema.ekstrakurikuler, pgSchema.ekstrakurikuler);
    await migrateTable('core_dokumentasi', mysqlSchema.dokumentasi, pgSchema.dokumentasi);
    await migrateTable('core_jadwalharian', mysqlSchema.jadwalHarian, pgSchema.jadwalHarian);
    await migrateTable('core_persyaratan', mysqlSchema.persyaratan, pgSchema.persyaratan);
    await migrateTable('core_alurpendaftaran', mysqlSchema.alurPendaftaran, pgSchema.alurPendaftaran);
    await migrateTable('core_biayapendidikan', mysqlSchema.biayaPendidikan, pgSchema.biayaPendidikan);
    await migrateTable('core_contactperson', mysqlSchema.contactPersons, pgSchema.contactPersons);
    await migrateTable('core_socialmedia', mysqlSchema.socialMedia, pgSchema.socialMedia);
    await migrateTable('core_seragam', mysqlSchema.seragam, pgSchema.seragam);
    await migrateTable('core_kmi', mysqlSchema.kmi, pgSchema.kmi);
    await migrateTable('core_statistik', mysqlSchema.statistik, pgSchema.statistik);
    await migrateTable('core_media', mysqlSchema.media, pgSchema.media);
    await migrateTable('core_bagianjabatan', mysqlSchema.bagianJabatan, pgSchema.bagianJabatan);
    await migrateTable('core_informasitambahan', mysqlSchema.informasiTambahan, pgSchema.informasiTambahan);
    await migrateTable('core_faq', mysqlSchema.faq, pgSchema.faq);
    await migrateTable('documents_documenttemplate', mysqlSchema.documentTemplates, pgSchema.documentTemplates);
    await migrateTable('system_settings', mysqlSchema.systemSettings, pgSchema.systemSettings);
    await migrateTable('payments_bankaccount', mysqlSchema.bankAccounts, pgSchema.bankAccounts);

    // Dependent tables (Level 1)
    await migrateTable('users_loginhistory', mysqlSchema.loginHistory, pgSchema.loginHistory);
    await migrateTable('notifications', mysqlSchema.notifications, pgSchema.notifications);
    await migrateTable('core_founders', mysqlSchema.founders, pgSchema.founders); // References users
    await migrateTable('blog_blogpost', mysqlSchema.blogPosts, pgSchema.blogPosts); // References users, categories
    await migrateTable('core_whatsapptemplate', mysqlSchema.whatsappTemplates, pgSchema.whatsappTemplates); // References categories
    await migrateTable('core_sejarahtimelineimage', mysqlSchema.sejarahTimelineImages, pgSchema.sejarahTimelineImages);
    await migrateTable('core_programpendidikanimage', mysqlSchema.programPendidikanImages, pgSchema.programPendidikanImages);
    await migrateTable('core_ekstrakurikulerimage', mysqlSchema.ekstrakurikulerImages, pgSchema.ekstrakurikulerImages);
    await migrateTable('core_dokumentasiimage', mysqlSchema.dokumentasiImages, pgSchema.dokumentasiImages);
    await migrateTable('core_tenagapengajar', mysqlSchema.tenagaPengajar, pgSchema.tenagaPengajar); // References bagianJabatan
    await migrateTable('admin_panel_bugnote', mysqlSchema.adminBugnotes, pgSchema.adminBugnotes); // References users
    await migrateTable('admin_panel_convertedimage', mysqlSchema.adminConvertedImages, pgSchema.adminConvertedImages); // References users
    await migrateTable('admissions_santri', mysqlSchema.santri, pgSchema.santri); // Independent mostly

    // Dependent tables (Level 2)
    await migrateTable('blog_blogpost_tags', mysqlSchema.blogPostTags, pgSchema.blogPostTags); // References posts, tags
    await migrateTable('admissions_exam_schedules', mysqlSchema.examSchedules, pgSchema.examSchedules); // References santri
    await migrateTable('admissions_exam_results', mysqlSchema.examResults, pgSchema.examResults); // References santri
    await migrateTable('payments_payment', mysqlSchema.payments, pgSchema.payments); // References santri, users
    
    // Tables I might have missed or added recently
    await migrateTable('blog_pengumuman', mysqlSchema.blogAnnouncements, pgSchema.blogAnnouncements);
    await migrateTable('blog_testimoni', mysqlSchema.blogTestimonials, pgSchema.blogTestimonials);

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mysqlConnection.end();
    await pgClient.end();
  }
};

migrate();
