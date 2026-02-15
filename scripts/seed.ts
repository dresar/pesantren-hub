import { db } from '../server/db';
import { 
  users, websiteSettings, blogCategories, blogTags, blogPosts, blogPostTags, 
  blogAnnouncements, blogTestimonials, santri, examSchedules, examResults, 
  payments, bankAccounts, websiteRegistrationFlow, founders, faq, programs, 
  whatsappTemplateCategories, whatsappTemplates, kontak, heroSection, 
  sejarahTimeline, sejarahTimelineImages, visiMisi, programPendidikan, 
  programPendidikanImages, fasilitas, ekstrakurikuler, ekstrakurikulerImages, 
  dokumentasi, dokumentasiImages, jadwalHarian, persyaratan, alurPendaftaran, 
  biayaPendidikan, contactPersons, socialMedia, seragam, kmi, statistik, 
  media, bagianJabatan, tenagaPengajar, informasiTambahan, documentTemplates, 
  systemSettings, adminBugnotes
} from '../server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { encrypt } from '../server/utils/encryption';

async function seed() {
  console.log('🌱 Starting comprehensive database seed...');

  try {
    const now = new Date().toISOString();

    // --- 1. USERS & AUTH ---
    console.log('👤 Seeding Users...');
    let adminId;
    const adminEmail = 'admin@pesantren.com';
    const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail));
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const [newAdmin] = await db.insert(users).values({
        username: 'dev_admin',
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '081234567890',
        role: 'superadmin',
        isActive: true,
        isStaff: true,
        isSuperuser: true,
        dateJoined: now,
        createdAt: now,
        updatedAt: now,
      }).returning();
      adminId = newAdmin.id;
      console.log('✅ Superadmin created');
    } else {
      adminId = existingAdmin[0].id;
      console.log('ℹ️ Superadmin already exists');
    }

    // --- 2. CORE SETTINGS ---
    console.log('⚙️ Seeding System & Website Settings...');
    
    // System Settings
    const existingSysSettings = await db.select().from(systemSettings).limit(1);
    if (existingSysSettings.length === 0) {
      await db.insert(systemSettings).values({
        maintenanceMode: false,
        allowRegistration: true,
        debugMode: true,
        sessionTimeout: 120,
        maxUploadSize: 10,
        backupFrequency: 'weekly',
        logRetentionDays: 60,
        updatedAt: now,
      });
      console.log('✅ System Settings created');
    }

    // Website Settings
    const existingWebSettings = await db.select().from(websiteSettings).limit(1);
    if (existingWebSettings.length === 0) {
      await db.insert(websiteSettings).values({
        namaPondok: 'Pesantren Hub Al-Falah',
        arabicName: 'معهد الفلاح الإسلامي',
        alamat: 'Jl. Raya Pesantren No. 99, Kota Santri, Indonesia',
        noTelepon: '0812-3456-7890',
        email: 'info@pesantrenhub.com',
        website: 'https://pesantrenhub.com',
        facebook: 'https://facebook.com/pesantrenhub',
        instagram: 'https://instagram.com/pesantrenhub',
        twitter: 'https://twitter.com/pesantrenhub',
        tiktok: 'https://tiktok.com/@pesantrenhub',
        heroTitle: 'Membangun Generasi Rabbani',
        heroSubtitle: 'Berilmu, Beramal, dan Bertaqwa',
        heroTagline: 'Pondok Pesantren Modern dengan Kurikulum Terpadu',
        heroCtaPrimaryText: 'Daftar Sekarang',
        heroCtaPrimaryLink: '/pendaftaran',
        heroCtaSecondaryText: 'Tentang Kami',
        heroCtaSecondaryLink: '/profil',
        announcementText: 'Pendaftaran Santri Baru Tahun Ajaran 2024/2025 Telah Dibuka!',
        announcementLink: '/pendaftaran',
        announcementActive: true,
        lokasiPendaftaran: 'Kantor Sekretariat PSB, Gedung A Lt. 1',
        googleMapsLink: 'https://maps.google.com/?q=Pesantren',
        googleMapsEmbedCode: '<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
        deskripsi: 'Pesantren Hub adalah lembaga pendidikan Islam modern yang memadukan kurikulum nasional dan kepesantrenan.',
        metaTitle: 'Pesantren Hub - Official Website',
        metaDescription: 'Website Resmi Pesantren Hub',
        metaKeywords: 'pesantren, islam, pendidikan, santri',
        updatedAt: now,
        headerMobileHeight: 60,
        maintenanceMessage: 'Sedang dalam pemeliharaan sistem',
        maintenanceMode: false,
        ctaTitle: 'Mari Bergabung Bersama Kami',
        ctaDescription: 'Jadilah bagian dari keluarga besar Pesantren Hub dan raih masa depan gemilang.',
        profilSingkat: 'Pesantren Hub didirikan pada tahun 2024 dengan visi mencetak kader ulama yang intelek.',
        profilLengkap: '<p>Sejarah panjang Pesantren Hub dimulai dari sebuah surau kecil...</p>',
      });
      console.log('✅ Website Settings created');
    }

    // --- 3. BLOG & CONTENT ---
    console.log('📝 Seeding Blog & Content...');
    
    // Categories
    const catName = 'Berita';
    let catId;
    const existingCat = await db.select().from(blogCategories).where(eq(blogCategories.name, catName));
    if (existingCat.length === 0) {
      const [newCat] = await db.insert(blogCategories).values({
        name: catName,
        slug: 'berita',
        order: 1,
        createdAt: now,
      }).returning();
      catId = newCat.id;
    } else {
      catId = existingCat[0].id;
    }

    // Tags
    const tagName = 'Pendidikan';
    let tagId;
    const existingTag = await db.select().from(blogTags).where(eq(blogTags.name, tagName));
    if (existingTag.length === 0) {
      const [newTag] = await db.insert(blogTags).values({
        name: tagName,
        slug: 'pendidikan',
        order: 1,
        createdAt: now,
      }).returning();
      tagId = newTag.id;
    } else {
      tagId = existingTag[0].id;
    }

    // Posts
    const postTitle = 'Selamat Datang di Website Baru Kami';
    const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.title, postTitle));
    if (existingPost.length === 0) {
      const [newPost] = await db.insert(blogPosts).values({
        title: postTitle,
        slug: 'selamat-datang',
        content: '<p>Alhamdulillah, website resmi Pesantren Hub telah diluncurkan.</p>',
        excerpt: 'Peluncuran website resmi Pesantren Hub.',
        status: 'published',
        authorId: adminId,
        categoryId: catId,
        metaTitle: postTitle,
        metaDescription: 'Berita peluncuran website',
        metaKeywords: 'website, launch',
        viewsCount: 100,
        likesCount: 10,
        sharesCount: 5,
        isFeatured: true,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      }).returning();
      
      // Link Tag
      await db.insert(blogPostTags).values({
        blogpostId: newPost.id,
        tagId: tagId
      });
      console.log('✅ Blog Post created');
    }

    // Announcements
    const announceTitle = 'Libur Semester Ganjil';
    const existingAnnounce = await db.select().from(blogAnnouncements).where(eq(blogAnnouncements.judul, announceTitle));
    if (existingAnnounce.length === 0) {
      await db.insert(blogAnnouncements).values({
        judul: announceTitle,
        slug: 'libur-semester-ganjil',
        konten: 'Libur dimulai tanggal 20 Desember.',
        status: 'published',
        isPenting: true,
        publishedAt: now,
        metaTitle: announceTitle,
        metaDescription: 'Info libur semester',
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Announcement created');
    }

    // Testimonials
    const testiName = 'Budi Santoso';
    const existingTesti = await db.select().from(blogTestimonials).where(eq(blogTestimonials.nama, testiName));
    if (existingTesti.length === 0) {
      await db.insert(blogTestimonials).values({
        nama: testiName,
        jabatan: 'Wali Santri',
        testimoni: 'Alhamdulillah anak saya betah dan hafalannya lancar.',
        rating: 5,
        isPublished: true,
        order: 1,
        createdAt: now,
      });
      console.log('✅ Testimonial created');
    }

    // --- 4. ACADEMIC & PROGRAMS ---
    console.log('📚 Seeding Academic & Programs...');

    // Programs (Core)
    const progName = 'Tahfidz Al-Quran';
    const existingProg = await db.select().from(programs).where(eq(programs.nama, progName));
    if (existingProg.length === 0) {
      await db.insert(programs).values({
        nama: progName,
        slug: 'tahfidz-al-quran',
        deskripsi: 'Program menghafal Al-Quran 30 Juz.',
        status: 'active',
        isFeatured: true,
        metaTitle: progName,
        metaDescription: 'Program unggulan tahfidz',
        order: 1,
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Core Program created');
    }

    // Program Pendidikan (Detailed)
    const eduProgName = 'Madrasah Tsanawiyah';
    const existingEduProg = await db.select().from(programPendidikan).where(eq(programPendidikan.nama, eduProgName));
    if (existingEduProg.length === 0) {
      await db.insert(programPendidikan).values({
        nama: eduProgName,
        akreditasi: 'A',
        icon: 'book',
        order: 1,
        createdAt: now,
      });
      console.log('✅ Educational Program created');
    }

    // KMI
    const existingKmi = await db.select().from(kmi).limit(1);
    if (existingKmi.length === 0) {
      await db.insert(kmi).values({
        visiKmi: 'Mencetak kader ulama intelek',
        profilKmi: 'Kulliyatul Muallimin Al-Islamiyah adalah sistem pendidikan...',
        updatedAt: now,
      });
      console.log('✅ KMI Profile created');
    }

    // --- 5. ADMISSIONS & PAYMENTS ---
    console.log('🎓 Seeding Admissions & Payments...');

    // Santri
    const santriName = 'Ahmad Fulan';
    const existingSantri = await db.select().from(santri).where(eq(santri.nisn, '1234567890'));
    let santriId;
    
    if (existingSantri.length === 0) {
      const [newSantri] = await db.insert(santri).values({
        namaLengkap: santriName,
        nisn: '1234567890',
        tempatLahir: 'Jakarta',
        tanggalLahir: '2010-01-01',
        jenisKelamin: 'L',
        agama: 'Islam',
        golonganDarah: 'O',
        namaAyah: 'Fulan Sr.',
        nikAyah: '3201010101010001',
        namaIbu: 'Fulanah',
        nikIbu: '3201010101010002',
        pekerjaanAyah: 'Wiraswasta',
        pekerjaanIbu: 'Ibu Rumah Tangga',
        noHpAyah: '08111111111',
        noHpIbu: '08222222222',
        alamatOrangTua: 'Jl. Orang Tua No. 1',
        alamat: 'Jl. Santri No. 1',
        noHp: '08333333333',
        email: 'santri@example.com',
        asalSekolah: 'SDIT Al-Falah',
        kelasTerakhir: '6',
        tahunLulus: '2023',
        noIjazah: 'IJZ-2023-001',
        fotoSantriApproved: true,
        fotoKtpApproved: true,
        fotoAktaApproved: true,
        fotoIjazahApproved: true,
        fotoKkApproved: true,
        suratSehatApproved: true,
        catatan: 'Santri berprestasi',
        status: 'verified',
        createdAt: now,
        updatedAt: now,
        // Additional fields defaults
        agamaAyah: 'Islam',
        agamaIbu: 'Islam',
        bahasaSehariHari: 'Indonesia',
        desa: 'Desa Contoh',
        kabupaten: 'Kabupaten Contoh',
        kecamatan: 'Kecamatan Contoh',
        kelasDiterima: '7',
        kewarganegaraan: 'WNI',
        kewarganegaraanAyah: 'WNI',
        kewarganegaraanIbu: 'WNI',
        kodePos: '12345',
        namaPanggilan: 'Ahmad',
        npsnSekolah: '10101010',
        pendidikanAyah: 'S1',
        pendidikanIbu: 'D3',
        provinsi: 'Jawa Barat',
        riwayatPenyakit: '-',
        statusAyah: 'Hidup',
        statusIbu: 'Hidup',
        tempatLahirAyah: 'Bandung',
        tempatLahirIbu: 'Bogor',
        tinggalDengan: 'Orang Tua'
      }).returning();
      santriId = newSantri.id;
      console.log('✅ Santri created');
    } else {
      santriId = existingSantri[0].id;
    }

    // Bank Accounts
    const bankName = 'BSI';
    const existingBank = await db.select().from(bankAccounts).where(eq(bankAccounts.namaBank, bankName));
    if (existingBank.length === 0) {
      await db.insert(bankAccounts).values({
        namaBank: bankName,
        namaBankCustom: 'Bank Syariah Indonesia',
        nomorRekening: '7778889990',
        namaPemilik: 'Yayasan Pesantren Hub',
        biayaPendaftaran: '250000',
        isActive: true,
        keterangan: 'Kode unik 3 digit terakhir',
        order: 1,
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Bank Account created');
    }

    // Registration Flow
    const existingFlow = await db.select().from(websiteRegistrationFlow).limit(1);
    if (existingFlow.length === 0) {
      await db.insert(websiteRegistrationFlow).values({
        title: 'Isi Formulir',
        description: 'Lengkapi data diri calon santri',
        icon: 'form',
        order: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Registration Flow created');
    }

    // Tuition Fees
    const feeName = 'SPP Bulanan';
    const existingFee = await db.select().from(biayaPendidikan).where(eq(biayaPendidikan.nama, feeName));
    if (existingFee.length === 0) {
      await db.insert(biayaPendidikan).values({
        tipe: 'Bulanan',
        nama: feeName,
        jumlah: '1500000',
        keterangan: 'Termasuk makan dan laundry',
        order: 1,
        createdAt: now,
      });
      console.log('✅ Tuition Fee created');
    }

    // --- 6. WEBSITE PROFILE & INFO ---
    console.log('🏛️ Seeding Profile & Info...');

    // Hero Section
    const existingHero = await db.select().from(heroSection).limit(1);
    if (existingHero.length === 0) {
      await db.insert(heroSection).values({
        title: 'Penerimaan Santri Baru',
        subtitle: 'Tahun Ajaran 2024/2025',
        order: 1,
        isActive: true,
        createdAt: now,
      });
      console.log('✅ Hero Section created');
    }

    // Founders
    const founderName = 'KH. Ahmad Dahlan';
    const existingFounder = await db.select().from(founders).where(eq(founders.namaLengkap, founderName));
    if (existingFounder.length === 0) {
      await db.insert(founders).values({
        namaLengkap: founderName,
        tanggalLahir: '1970-01-01',
        jabatan: 'Pendiri',
        nik: encrypt('1234567890123456'),
        email: encrypt('founder@pesantren.com'),
        noTelepon: '08123456789',
        alamat: 'Komplek Pesantren',
        foto: '',
        pendidikanTerakhir: 'S3',
        profilSingkat: 'Pendiri dan pengasuh utama pesantren.',
        isDeleted: false,
        createdBy: adminId,
        updatedBy: adminId,
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Founder created');
    }

    // Visi Misi
    const existingVisi = await db.select().from(visiMisi).limit(1);
    if (existingVisi.length === 0) {
      await db.insert(visiMisi).values({
        visi: 'Menjadi pesantren unggulan dunia',
        misi: 'Menyelenggarakan pendidikan berkualitas',
        updatedAt: now,
      });
      console.log('✅ Visi Misi created');
    }

    // FAQ
    const faqQ = 'Apakah menerima pindahan?';
    const existingFaq = await db.select().from(faq).where(eq(faq.pertanyaan, faqQ));
    if (existingFaq.length === 0) {
      await db.insert(faq).values({
        pertanyaan: faqQ,
        jawaban: 'Ya, kami menerima santri pindahan dengan syarat tertentu.',
        kategori: 'Pendaftaran',
        order: 1,
        isPublished: true,
        createdAt: now,
      });
      console.log('✅ FAQ created');
    }

    // Contact
    const contactName = 'Ustadz Budi';
    const existingContact = await db.select().from(contactPersons).where(eq(contactPersons.nama, contactName));
    if (existingContact.length === 0) {
      await db.insert(contactPersons).values({
        nama: contactName,
        noHp: '081299998888',
        order: 1,
        isActive: true,
        createdAt: now,
      });
      console.log('✅ Contact Person created');
    }

    // Social Media
    const existingSocmed = await db.select().from(socialMedia).where(eq(socialMedia.platform, 'Instagram'));
    if (existingSocmed.length === 0) {
      await db.insert(socialMedia).values({
        platform: 'Instagram',
        username: '@pesantrenhub',
        url: 'https://instagram.com/pesantrenhub',
        order: 1,
        isActive: true,
        createdAt: now,
      });
      console.log('✅ Social Media created');
    }

    // Facilities
    const facName = 'Masjid Jami';
    const existingFac = await db.select().from(fasilitas).where(eq(fasilitas.nama, facName));
    if (existingFac.length === 0) {
      await db.insert(fasilitas).values({
        nama: facName,
        icon: 'mosque',
        order: 1,
        createdAt: now,
      });
      console.log('✅ Facility created');
    }

    // Extracurriculars
    const exName = 'Pramuka';
    const existingEx = await db.select().from(ekstrakurikuler).where(eq(ekstrakurikuler.nama, exName));
    if (existingEx.length === 0) {
      await db.insert(ekstrakurikuler).values({
        nama: exName,
        icon: 'scout',
        order: 1,
        createdAt: now,
      });
      console.log('✅ Extracurricular created');
    }

    // Staff/Teachers
    const deptName = 'Bahasa Arab';
    let deptId;
    const existingDept = await db.select().from(bagianJabatan).where(eq(bagianJabatan.nama, deptName));
    if (existingDept.length === 0) {
      const [newDept] = await db.insert(bagianJabatan).values({
        nama: deptName,
        deskripsi: 'Departemen Bahasa Arab',
        order: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      }).returning();
      deptId = newDept.id;
    } else {
      deptId = existingDept[0].id;
    }

    const teacherName = 'Ustadz Ali';
    const existingTeacher = await db.select().from(tenagaPengajar).where(eq(tenagaPengajar.namaLengkap, teacherName));
    if (existingTeacher.length === 0) {
      await db.insert(tenagaPengajar).values({
        namaLengkap: teacherName,
        namaPanggilan: 'Ali',
        jenisKelamin: 'L',
        tempatLahir: 'Cairo',
        tanggalLahir: '1985-05-05',
        alamat: 'Asrama Guru',
        noHp: '08555555555',
        email: 'ali@pesantren.com',
        pendidikanTerakhir: 'S2',
        universitas: 'Al-Azhar',
        tahunLulus: '2010',
        bidangKeahlian: 'Nahwu Shorof',
        mataPelajaran: 'Bahasa Arab',
        pengalamanMengajar: '10 Tahun',
        prestasi: 'Juara Pidato',
        riwayatPendidikan: 'S1, S2 Al-Azhar',
        organisasi: 'Persatuan Guru',
        karyaTulis: 'Metode Cepat Belajar Arab',
        motto: 'Man Jadda Wajada',
        whatsapp: '08555555555',
        facebook: 'ali.arab',
        instagram: 'ali.arab',
        twitter: 'ali.arab',
        linkedin: 'ali-arab',
        youtube: 'ali.arab',
        tiktok: 'ali.arab',
        order: 1,
        isPublished: true,
        isFeatured: true,
        createdAt: now,
        updatedAt: now,
        bagianJabatanId: deptId,
      });
      console.log('✅ Teacher created');
    }

    // Statistics
    const statTitle = 'Jumlah Santri';
    const existingStat = await db.select().from(statistik).where(eq(statistik.judul, statTitle));
    if (existingStat.length === 0) {
      await db.insert(statistik).values({
        judul: statTitle,
        nilai: '1500+',
        icon: 'users',
        deskripsi: 'Santri aktif dari seluruh Indonesia',
        warna: 'blue',
        order: 1,
        isPublished: true,
        createdAt: now,
      });
      console.log('✅ Statistic created');
    }
    
    // Document Templates
    const docName = 'Surat Keterangan Aktif';
    const existingDoc = await db.select().from(documentTemplates).where(eq(documentTemplates.nama, docName));
    if (existingDoc.length === 0) {
      await db.insert(documentTemplates).values({
        nama: docName,
        slug: 'surat-keterangan-aktif',
        deskripsi: 'Surat keterangan santri aktif',
        htmlTemplate: '<p>Dengan ini menerangkan...</p>',
        cssTemplate: 'body { font-family: serif; }',
        ukuranKertas: 'A4',
        orientasi: 'portrait',
        marginTop: '2cm',
        marginRight: '2cm',
        marginBottom: '2cm',
        marginLeft: '2cm',
        isActive: true,
        order: 1,
        createdAt: now,
        updatedAt: now,
      });
      console.log('✅ Document Template created');
    }

    console.log('✨ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seed();
