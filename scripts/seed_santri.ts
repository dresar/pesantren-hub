import { db } from '../server/db';
import { users, santri } from '../server/db/schema';
import { fakerID_ID as faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedSantri() {
  console.log('🌱 Seeding 100 Santri Data...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date().toISOString();

    const statuses = ['pending', 'verified', 'rejected', 'accepted'];
    const genders = ['L', 'P'];

    for (let i = 0; i < 100; i++) {
      const gender = faker.helpers.arrayElement(genders);
      const firstName = faker.person.firstName(gender === 'L' ? 'male' : 'female');
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName, provider: `example${i}.com` }).toLowerCase();
      const username = `santri_new_${i + 1}`;
      
      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.username, username));
      if (existingUser.length > 0) {
        console.log(`Skipping ${username}, already exists.`);
        continue;
      }
      const [newUser] = await db.insert(users).values({
        username: username,
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phone: faker.phone.number(),
        role: 'santri',
        isActive: true,
        isStaff: false,
        isSuperuser: false,
        dateJoined: now,
        createdAt: now,
        updatedAt: now,
      }).returning();

      console.log(`👤 Created user: ${username}`);

      // 2. Create Santri Data
      const status = faker.helpers.arrayElement(statuses);
      const isComplete = status !== 'pending';
      
      await db.insert(santri).values({
        namaLengkap: fullName,
        nisn: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
        tempatLahir: faker.location.city(),
        tanggalLahir: faker.date.birthdate({ min: 12, max: 18, mode: 'age' }).toISOString().split('T')[0],
        jenisKelamin: gender,
        agama: 'Islam',
        golonganDarah: faker.helpers.arrayElement(['A', 'B', 'AB', 'O']),
        tinggiBadan: faker.number.int({ min: 140, max: 180 }),
        beratBadan: faker.number.int({ min: 35, max: 80 }),
        
        // Parent Data
        namaAyah: faker.person.fullName({ sex: 'male' }),
        nikAyah: faker.number.int({ min: 1000000000000000, max: 9999999999999999 }).toString(),
        namaIbu: faker.person.fullName({ sex: 'female' }),
        nikIbu: faker.number.int({ min: 1000000000000000, max: 9999999999999999 }).toString(),
        pekerjaanAyah: faker.person.jobTitle(),
        pekerjaanIbu: faker.helpers.arrayElement(['Ibu Rumah Tangga', faker.person.jobTitle()]),
        noHpAyah: faker.string.numeric(12),
        noHpIbu: faker.string.numeric(12),
        alamatOrangTua: faker.location.streetAddress({ useFullAddress: true }),
        
        // Contact & Address
        alamat: faker.location.streetAddress({ useFullAddress: true }),
        noHp: faker.string.numeric(12),
        email: email,
        
        // Education
        asalSekolah: `SDIT ${faker.location.city()}`,
        kelasTerakhir: '6 SD',
        tahunLulus: '2025',
        noIjazah: `DN-${faker.string.alphanumeric(10).toUpperCase()}`,
        npsnSekolah: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
        
        // Documents (Randomly approved based on status)
        fotoSantriApproved: isComplete,
        fotoKtpApproved: isComplete,
        fotoAktaApproved: isComplete,
        fotoIjazahApproved: isComplete,
        fotoKkApproved: isComplete,
        suratSehatApproved: isComplete,
        
        // Status & Meta
        catatan: status === 'rejected' ? 'Dokumen tidak lengkap' : '-',
        status: status,
        createdAt: faker.date.past().toISOString(),
        updatedAt: now,
        
        // Additional Required Fields
        agamaAyah: 'Islam',
        agamaIbu: 'Islam',
        bahasaSehariHari: 'Indonesia',
        desa: faker.location.street(),
        kabupaten: faker.location.city(),
        kecamatan: faker.location.city(), // Faker doesn't have kecamatan, using city
        kelasDiterima: '7',
        kewarganegaraan: 'WNI',
        kewarganegaraanAyah: 'WNI',
        kewarganegaraanIbu: 'WNI',
        kodePos: faker.location.zipCode(),
        namaPanggilan: firstName,
        pendidikanAyah: faker.helpers.arrayElement(['SD', 'SMP', 'SMA', 'S1', 'S2']),
        pendidikanIbu: faker.helpers.arrayElement(['SD', 'SMP', 'SMA', 'S1', 'S2']),
        provinsi: faker.location.state(),
        riwayatPenyakit: '-',
        statusAyah: 'Hidup',
        statusIbu: 'Hidup',
        tempatLahirAyah: faker.location.city(),
        tempatLahirIbu: faker.location.city(),
        tinggalDengan: 'Orang Tua',
        
        // Optional Fields
        anakKe: faker.number.int({ min: 1, max: 5 }),
        jumlahSaudara: faker.number.int({ min: 1, max: 5 }),
        penghasilanAyah: faker.helpers.arrayElement(['< 1 Juta', '1-3 Juta', '3-5 Juta', '> 5 Juta']),
        penghasilanIbu: faker.helpers.arrayElement(['Tidak Berpenghasilan', '< 1 Juta', '1-3 Juta']),
      });
    }

    console.log('✅ Successfully seeded 100 santri data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedSantri();
