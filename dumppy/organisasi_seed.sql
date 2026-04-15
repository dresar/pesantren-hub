-- Reset tabel organisasi agar bersih
-- TRUNCATE TABLE core_struktur_organisasi RESTART IDENTITY CASCADE;

INSERT INTO core_struktur_organisasi (nama, jabatan, foto, level, "order", is_active, created_at, updated_at) VALUES 
('K.H. Ahmad Dahlan, M.A.', 'Pimpinan Pondok Pesantren', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400', 0, 1, true, NOW(), NOW()),

('Ustadz Ir. Budi Raharjo', 'Ketua Yayasan', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', 1, 1, true, NOW(), NOW()),
('Ustadz Dr. Fauzi Ihsan, Lc.', 'Direktur KMI', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', 1, 2, true, NOW(), NOW()),
('Ustazah Hj. Siti Maryam, M.Pd.', 'Kepala Pengasuhan Santriwati', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', 1, 3, true, NOW(), NOW()),

('Ustadz Hasan Basri, S.Pd.', 'Kepala Sekolah MTs', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 2, 1, true, NOW(), NOW()),
('Ustadz Ali Imran, M.Ag.', 'Kepala Sekolah MA', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', 2, 2, true, NOW(), NOW()),
('Ustazah Laila Fitri, S.E.', 'Bendahara Pondok', 'https://images.unsplash.com/photo-1531123897727-8f129e1bfa8ea?auto=format&fit=crop&q=80&w=400', 2, 3, true, NOW(), NOW()),
('Ustadz Zulfikar, S.Kom.', 'Kepala Tata Usaha', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', 2, 4, true, NOW(), NOW()),

('Ustazah Rina Mulyani, S.ST.', 'Kepala Unit Kesehatan', 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=400', 3, 1, true, NOW(), NOW()),
('Ustadz Anwar Sadat, Lc.', 'Koordinator Bahasa', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400', 3, 2, true, NOW(), NOW()),
('Ustazah Nadia Zein', 'Koordinator Tahfidz', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', 3, 3, true, NOW(), NOW()),
('Ustadz Tariq Rahman', 'Koordinator Olahraga', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', 3, 4, true, NOW(), NOW());
