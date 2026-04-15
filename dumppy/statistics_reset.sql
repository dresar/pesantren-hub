-- ==============================================================================
-- PESANTREN HUB — RESET & SEED DATA STATISTIK (REFINED)
-- Generated: 2026-04-16
-- ==============================================================================

-- 1. Hapus semua data statistik yang ada
DELETE FROM core_statistik;

-- 2. Masukkan 4 data statistik baru yang spesifik tentang Santri
INSERT INTO core_statistik (judul, nilai, icon, deskripsi, warna, "order", is_published, created_at)
VALUES 
('Total Santri', '1,250+', 'Users', 'Santri aktif yang menimba ilmu dari berbagai daerah di Indonesia.', 'blue', 1, true, NOW()),
('Santri Hafidz 30 Juz', '52', 'Award', 'Santri yang telah menyelesaikan setoran hafalan Al-Qur''an 30 Juz.', 'green', 2, true, NOW()),
('Tenaga Pengajar', '94', 'GraduationCap', 'Ustadz dan pengasuh lulusan Timur Tengah dan Universitas Nasional.', 'orange', 3, true, NOW()),
('Alumni Berkhidmat', '1,800+', 'Calendar', 'Lulusan yang kini mengabdi di berbagai pesantren dan lembaga dakwah.', 'purple', 4, true, NOW());

-- ==============================================================================
-- SELESAI
-- ==============================================================================
