-- SQL Dump for Hero Sections (core_herosection)
-- This file contains realistic hero slides for Pondok Pesantren Modern Raudhatussalam Mahato

INSERT INTO core_herosection (id, title, subtitle, image, "order", is_active, created_at)
VALUES 
(1, 'Selamat Datang di Pondok Pesantren Modern Raudhatussalam Mahato', 'Membangun Generasi Rabbani, Berakhlak Mulia, dan Berwawasan Luas', 'https://images.unsplash.com/photo-1590076215667-875d4ef2d998?auto=format&fit=crop&q=80&w=1920', 1, true, NOW()),

(2, 'Pendidikan Berkualitas dengan Kurikulum Terpadu', 'Memadukan Kurikulum KMI Gontor, Pesantren Modern, dan Pendidikan Nasional', 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=1920', 2, true, NOW()),

(3, 'Menciptakan Karakter Santri yang Mandiri & Kreatif', 'Fasilitas Lengkap dan Ekstrakurikuler yang Mengasah Bakat serta Minat Santri', 'https://images.unsplash.com/photo-1517486808906-6ca8b3ef0a6d?auto=format&fit=crop&q=80&w=1920', 3, true, NOW())

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    image = EXCLUDED.image,
    "order" = EXCLUDED."order",
    is_active = EXCLUDED.is_active;
