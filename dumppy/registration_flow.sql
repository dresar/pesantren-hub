/*
 * Realistic Dummy Data for Registration Flow - Pondok Pesantren Modern Raudhatussalam Mahato
 * Target Table: core_registration_flow
 */

-- Cleanup existing data if needed (Optional: usually better to let user decide, but for dummy data it's easier to truncate)
-- TRUNCATE TABLE core_registration_flow;

INSERT INTO core_registration_flow (id, title, description, icon, "order", is_active, created_at, updated_at)
VALUES 
(
    1, 
    'Pendaftaran Akun', 
    'Calon santri atau orang tua wali membuat akun pendaftaran menggunakan email dan nomor WhatsApp aktif untuk mendapatkan nomor registrasi.', 
    'UserCheck', 
    1, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    2, 
    'Pengisian Formulir', 
    'Melengkapi formulir data diri, data orang tua, riwayat kesehatan, dan riwayat pendidikan serta mengunggah dokumen yang diperlukan (KK, Akta, Ijazah).', 
    'ClipboardList', 
    2, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    3, 
    'Pembayaran Administrasi', 
    'Melakukan pembayaran biaya pendaftaran sebesar Rp 350.000 melalui rekening resmi pondok dan mengunggah bukti pembayaran di sistem.', 
    'CreditCard', 
    3, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    4, 
    'Verifikasi & Ujian Seleksi', 
    'Mengikuti ujian seleksi (Tes Baca Al-Qur''an, Tes Tertulis, & Wawancara) sesuai jadwal yang dipilih. Jangan lupa membawa kartu peserta pendaftaran.', 
    'FileText', 
    4, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    5, 
    'Pengumuman Hasil', 
    'Hasil seleksi akan diumumkan melalui dashboard pendaftaran dan WhatsApp resmi. Santri yang lulus akan mendapatkan SK Kelulusan Digital.', 
    'GraduationCap', 
    5, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
),
(
    6, 
    'Daftar Ulang & Seragam', 
    'Calon santri yang lulus melakukan daftar ulang, pengukuran seragam, serta serah terima berkas fisik dan penyelesaian biaya pangkal (uang gedung).', 
    'CheckCircle2', 
    6, 
    true, 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;
