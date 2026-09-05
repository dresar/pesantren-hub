import { Hono } from 'hono';

const kmi = new Hono();

// --- KMI MOCKS DATA ---

const MOCK_RUMPUN = [
  { id: 1, kode: 'ISL', nama: 'Ulum Islamiyah', namaArab: 'العلوم الإسلامية', gradient: 'from-emerald-500 to-teal-600', icon: '☪️' },
  { id: 2, kode: 'ARB', nama: 'Ulum Arabiyah', namaArab: 'العلوم العربية', gradient: 'from-blue-500 to-indigo-600', icon: '📜' },
  { id: 3, kode: 'AMM', nama: 'Ulum Ammah', namaArab: 'العلوم العامة', gradient: 'from-amber-500 to-orange-600', icon: '📐' },
];

const MOCK_MAPEL = [
  { id: 1, kode: 'TFS', nama: 'Tafsir Jalalain', namaArab: 'تفسير الجلالين', rumpunKode: 'ISL', rumpunId: 1, kkm: 75, jenjang: '1-6' },
  { id: 2, kode: 'FIQ', nama: 'Fiqh (Fathul Qarib)', namaArab: 'فتح القريب', rumpunKode: 'ISL', rumpunId: 1, kkm: 70, jenjang: '3-6' },
  { id: 3, kode: 'NHW', nama: 'Nahwu (Alfiyah)', namaArab: 'ألفية ابن malik', rumpunKode: 'ARB', rumpunId: 2, kkm: 70, jenjang: '3-6' },
  { id: 4, kode: 'IML', nama: 'Imla\'', namaArab: 'الإملاء', rumpunKode: 'ARB', rumpunId: 2, kkm: 65, jenjang: '1-2' },
  { id: 5, kode: 'MTH', nama: 'Matematika', namaArab: 'الرياضيات', rumpunKode: 'AMM', rumpunId: 3, kkm: 70, jenjang: '1-6' },
  { id: 6, kode: 'ENG', nama: 'English (Conversation)', namaArab: 'اللغة الإنجليزية', rumpunKode: 'ARB', rumpunId: 2, kkm: 70, jenjang: '1-6' },
  { id: 7, kode: 'PHY', nama: 'Fisika', namaArab: 'الفيزياء', rumpunKode: 'AMM', rumpunId: 3, kkm: 65, jenjang: '3-6' },
];

const MOCK_KELAS = [
  { id: 1, nama: '1 A', jenjang: '1', jenisKelamin: 'putra', waliKelas: 'Dr. Ahmad Fauzi', santriCount: 32, kapasitas: 35, anggota: [] },
  { id: 2, nama: '1 B', jenjang: '1', jenisKelamin: 'putra', waliKelas: 'Ust. Ridwan Hakim', santriCount: 30, kapasitas: 35, anggota: [] },
  { id: 3, nama: '2 Putri A', jenjang: '2', jenisKelamin: 'putri', waliKelas: 'Ustz. Siti Fatimah', santriCount: 28, kapasitas: 35, anggota: [] },
  { id: 4, nama: '6 Intensif', jenjang: '6', jenisKelamin: 'putra', waliKelas: 'KH. Abdullah Syukri', santriCount: 25, kapasitas: 30, anggota: [] },
];

const MOCK_SANTRI = [
  { id: 1, nama: 'Muhammad Faras', namaLengkap: 'Muhammad Faras', nisn: '12345678', kelas: '1 A', rumpun: 'Putra', santriId: 1 },
  { id: 2, nama: 'Abdullah Azzam', namaLengkap: 'Abdullah Azzam', nisn: '12345679', kelas: '1 A', rumpun: 'Putra', santriId: 2 },
  { id: 3, nama: 'Aisyah Humairah', namaLengkap: 'Aisyah Humairah', nisn: '12345680', kelas: '2 Putri A', rumpun: 'Putri', santriId: 3 },
];

// Attach members to mock kelas 1
MOCK_KELAS[0].anggota = MOCK_SANTRI as any;

const MOCK_JADWAL = [
  { id: 1, hari: 'senin', jamKe: 1, mapelNama: 'Nahwu', guruNama: 'Ust. Zae' },
  { id: 2, hari: 'senin', jamKe: 2, mapelNama: 'Nahwu', guruNama: 'Ust. Zae' },
  { id: 3, hari: 'senin', jamKe: 3, mapelNama: 'Tafsir', guruNama: 'Ust. Ahmad' },
  { id: 4, hari: 'selasa', jamKe: 1, mapelNama: 'English', guruNama: 'Mr. John' },
];

const MOCK_JAM_PELAJARAN = [
  { jamKe: 1, jamMulai: '07:00', jamSelesai: '07:45' },
  { jamKe: 2, jamMulai: '07:45', jamSelesai: '08:30' },
  { jamKe: 3, jamMulai: '08:30', jamSelesai: '09:15' },
  { jamKe: 4, jamMulai: '09:45', jamSelesai: '10:30' },
  { jamKe: 5, jamMulai: '10:30', jamSelesai: '11:15' },
];

const MOCK_GURU_MAPEL = [
  { id: 1, mapelId: 1, mapelNama: 'Tafsir', guruId: 1, guruNama: 'Ust. Ahmad' },
  { id: 2, mapelId: 3, mapelNama: 'Nahwu', guruId: 2, guruNama: 'Ust. Ridwan' },
  { id: 3, mapelId: 5, mapelNama: 'Matematika', guruId: 3, guruNama: 'Mr. Budi' },
];

const MOCK_RAPOR_LIST = [
  { id: 1, santriId: 1, namaLengkap: 'Muhammad Faras', nisn: '12345678', peringkatKelas: 1, jumlahSiswaKelas: 32, nilaiRataRata: 88.5, predikatUmum: 'Mumtaz', totalHadir: 100, totalSakit: 2, totalIzin: 1, totalAlfa: 0, statusNaikKelas: 'naik' },
  { id: 2, santriId: 2, namaLengkap: 'Abdullah Azzam', nisn: '12345679', peringkatKelas: 2, jumlahSiswaKelas: 32, nilaiRataRata: 85.2, predikatUmum: 'Jayyid Jiddan', totalHadir: 98, totalSakit: 1, totalIzin: 4, totalAlfa: 0, statusNaikKelas: 'naik' },
];

const MOCK_RAPOR_DETAIL = {
  rapor: MOCK_RAPOR_LIST[0],
  santri: { id: 1, namaLengkap: 'Muhammad Faras', nisn: '12345678', namaAyah: 'H. Ahmad Syarif' },
  semester: { id: 1, semester: 'Ganjil', tahunAjaranId: '2025/2026' },
  kelas: { id: 1, nama: '1 A', waliKelasNama: 'Dr. Ahmad Fauzi', jenjang: { program: 'reguler' } },
  nilai: [
    { mapelNama: 'Tafsir Jalalain', rumpunNama: 'Ulum Islamiyah', rumpunKode: 'ISL', nilaiHarian: 85, nilaiUts: 80, nilaiUas: 90, nilaiAkhir: 86, kkm: 75, predikat: 'Mumtaz' },
    { mapelNama: 'Nahwu Alfiyah', rumpunNama: 'Ulum Arabiyah', rumpunKode: 'ARB', nilaiHarian: 90, nilaiUts: 85, nilaiUas: 92, nilaiAkhir: 90, kkm: 70, predikat: 'Mumtaz' },
  ]
};

const MOCK_DASHBOARD = {
  totalSantri: 420,
  totalKelas: 14,
  totalMapel: 32,
  totalGuru: 48,
  absensiHariIni: 12,
  nilaiMenunggu: 15,
  raporDraft: 4,
  tahunAjaran: '2025/2026',
  semesterAktif: 'Ganjil'
};

const MOCK_SEMESTER = [
  { id: 1, semester: 'Ganjil', isAktif: true, tahunAjaranId: 1, nama: 'Ganjil 2025/2026' },
  { id: 2, semester: 'Genap', isAktif: false, tahunAjaranId: 1, nama: 'Genap 2025/2026' }
];

const MOCK_TAHUN_AJARAN = [
  { id: 1, nama: '2025/2026', isAktif: true, tanggalMulai: '2025-07-01', tanggalSelesai: '2026-06-30' }
];

const MOCK_GURU = [
  { id: 1, nama: 'Dr. Ahmad Fauzi', nip: '198203112009121003', bidKeahlian: 'Tafsir' },
  { id: 2, nama: 'Ust. Ridwan Hakim', nip: '198510222012121004', bidKeahlian: 'Nahwu' },
  { id: 3, nama: 'Ustz. Siti Fatimah', nip: '198904122015122002', bidKeahlian: 'Fiqh' },
];

const MOCK_JENJANG = [
  { id: 1, nama: 'Kelas 1', tingkat: 1, tipe: 'Reguler' },
  { id: 2, nama: 'Kelas 2', tingkat: 2, tipe: 'Reguler' },
  { id: 3, nama: 'Kelas 3', tingkat: 3, tipe: 'Reguler' },
];

// --- API IMPLEMENTATION ---

// Semester
kmi.get('/semester', (c) => c.json(MOCK_SEMESTER));
kmi.post('/semester', (c) => c.json({ success: true, message: 'Semester created' }));

// Tahun Ajaran
kmi.get('/tahun-ajaran', (c) => c.json(MOCK_TAHUN_AJARAN));
kmi.post('/tahun-ajaran', (c) => c.json({ success: true, message: 'Tahun ajaran created' }));
kmi.put('/tahun-ajaran/:id', (c) => c.json({ success: true, message: 'Tahun ajaran updated' }));
kmi.delete('/tahun-ajaran/:id', (c) => c.json({ success: true, message: 'Tahun ajaran deleted' }));

// Kelas
kmi.get('/kelas', (c) => c.json(MOCK_KELAS));
kmi.get('/kelas/:id', (c) => {
  const id = Number(c.req.param('id'));
  const kls = MOCK_KELAS.find(k => k.id === id) || MOCK_KELAS[0];
  return c.json(kls);
});
kmi.post('/kelas', (c) => c.json({ success: true, message: 'Kelas created' }));
kmi.put('/kelas/:id', (c) => c.json({ success: true, message: 'Kelas updated' }));
kmi.delete('/kelas/:id', (c) => c.json({ success: true, message: 'Kelas deleted' }));
kmi.post('/kelas/:id/anggota', (c) => c.json({ success: true, message: 'Anggota added' }));
kmi.delete('/kelas/:id/anggota/:anggotaId', (c) => c.json({ success: true, message: 'Anggota deleted' }));

// Mapel
kmi.get('/mapel', (c) => c.json(MOCK_MAPEL));
kmi.post('/mapel', (c) => c.json({ success: true, message: 'Mapel created' }));
kmi.put('/mapel/:id', (c) => c.json({ success: true, message: 'Mapel updated' }));
kmi.delete('/mapel/:id', (c) => c.json({ success: true, message: 'Mapel deleted' }));

// Rumpun
kmi.get('/rumpun', (c) => c.json(MOCK_RUMPUN));

// Guru
kmi.get('/options/guru', (c) => c.json(MOCK_GURU));
kmi.get('/options/santri-unassigned', (c) => c.json(MOCK_SANTRI));

// Jenjang
kmi.get('/jenjang', (c) => c.json(MOCK_JENJANG));

// Guru Mapel Assignment
kmi.get('/guru-mapel', (c) => c.json(MOCK_GURU_MAPEL));
kmi.post('/guru-mapel', (c) => c.json({ success: true, message: 'Guru assigned' }));

// Jam Pelajaran
kmi.get('/jam-pelajaran', (c) => c.json(MOCK_JAM_PELAJARAN));

// Jadwal
kmi.get('/jadwal', (c) => c.json(MOCK_JADWAL));
kmi.post('/jadwal', (c) => c.json({ success: true, message: 'Jadwal created' }));
kmi.delete('/jadwal/:id', (c) => c.json({ success: true, message: 'Jadwal deleted' }));

// Absensi
kmi.get('/absensi', (c) => c.json([]));
kmi.post('/absensi', (c) => c.json({ success: true, message: 'Absensi recorded' }));

// Nilai
kmi.get('/nilai', (c) => c.json([]));
kmi.post('/nilai/bulk', (c) => c.json({ success: true, message: 'Nilai updated' }));

// Rapor
kmi.get('/rapor', (c) => c.json(MOCK_RAPOR_LIST));
kmi.get('/rapor/:id/detail', (c) => c.json(MOCK_RAPOR_DETAIL));
kmi.post('/rapor/generate', (c) => c.json({ success: true, message: 'Rapor generated' }));

// Ko-kurikuler
kmi.get('/kokur/jenis', (c) => c.json([]));
kmi.post('/kokur/jenis', (c) => c.json({ success: true, message: 'Kokur jenis created' }));
kmi.get('/kokur/sesi', (c) => c.json([]));
kmi.post('/kokur/sesi', (c) => c.json({ success: true, message: 'Kokur sesi created' }));

// Dashboard
kmi.get('/dashboard/stats', (c) => c.json(MOCK_DASHBOARD));
kmi.get('/kalender', (c) => c.json([]));

export default kmi;
