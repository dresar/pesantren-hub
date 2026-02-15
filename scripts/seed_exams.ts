import { db } from '../server/db';
import { santri, examSchedules, examResults } from '../server/db/schema';
import { fakerID_ID as faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

async function seedExamData() {
  console.log('🌱 Seeding Exam Data...');

  try {
    const now = new Date();
    
    // Get all santri
    const allSantri = await db.select().from(santri);
    
    if (allSantri.length === 0) {
      console.log('⚠️ No santri found. Please run seed_santri.ts first.');
      process.exit(1);
    }
    
    console.log(`Found ${allSantri.length} santri. Generating exam data...`);

    const examTypes = ['Tulis', 'Wawancara', 'Al-Quran'];
    const examiners = ['Ustadz Ahmad', 'Ustadz Budi', 'Ustadzah Siti', 'Ustadz Dedi'];
    const locations = ['Ruang Kelas 1', 'Ruang Kelas 2', 'Aula Utama', 'Kantor Guru'];

    for (const student of allSantri) {
      // 1. Create Exam Schedules (Jadwal Seleksi)
      // Only for verified/accepted/pending santri (not rejected)
      if (student.status === 'rejected') continue;

      const numExams = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < numExams; i++) {
        // Randomly assign exam type, avoid duplicates if possible or just pick one
        const type = examTypes[i % examTypes.length]; 
        
        await db.insert(examSchedules).values({
          santriId: student.id,
          type: type,
          scheduledDate: faker.date.soon({ days: 14 }).toISOString(),
          location: faker.helpers.arrayElement(locations),
          examiner: faker.helpers.arrayElement(examiners),
          status: 'scheduled',
          notes: 'Harap membawa alat tulis',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        });
      }

      // 2. Create Exam Results (Hasil Seleksi)
      // Only for santri who are 'verified', 'accepted', or 'rejected' (but processed)
      // If status is 'pending', they might not have results yet.
      if (['verified', 'accepted', 'rejected'].includes(student.status)) {
        
        // Generate scores
        const written = faker.number.float({ min: 40, max: 100, precision: 0.1 });
        const interview = faker.number.float({ min: 50, max: 100, precision: 0.1 });
        const quran = faker.number.float({ min: 40, max: 100, precision: 0.1 });
        const total = (written + interview + quran) / 3;

        // Determine pass/fail based on student status or score
        let resultStatus = 'pending';
        if (student.status === 'accepted') resultStatus = 'passed';
        else if (student.status === 'rejected') resultStatus = 'failed';
        else resultStatus = total >= 70 ? 'passed' : 'failed';

        await db.insert(examResults).values({
          santriId: student.id,
          writtenTestScore: written.toFixed(2),
          interviewScore: interview.toFixed(2),
          quranTestScore: quran.toFixed(2),
          totalScore: total.toFixed(2),
          status: resultStatus,
          decisionDate: faker.date.recent().toISOString(),
          isPublished: true, // Published so they can see it
          notes: total >= 85 ? 'Sangat Baik' : (total >= 70 ? 'Baik' : 'Perlu ditingkatkan'),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        });
      }
    }

    console.log('✅ Exam data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding exam data failed:', error);
    process.exit(1);
  }
}

seedExamData();
