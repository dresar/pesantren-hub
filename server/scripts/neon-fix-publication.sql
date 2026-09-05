-- ============================================================
-- Script untuk Neon: sesuaikan tabel publication dengan kode
-- Jalankan di Neon SQL Editor (sekali saja)
-- ============================================================
--
-- CEPAT: kalau cuma error "column collaboration_id does not exist",
-- jalankan saja blok ini:
--
--   ALTER TABLE publication_articles
--   ADD COLUMN IF NOT EXISTS collaboration_id INTEGER REFERENCES publication_collaborations(id);
--
-- Kalau tabel publication_collaborations belum ada, jalankan seluruh script di bawah.
-- ============================================================

-- 1. Pastikan tabel publication_collaborations ada (biasanya sudah)
CREATE TABLE IF NOT EXISTS publication_collaborations (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id INTEGER NOT NULL REFERENCES users_user(id),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabel publication_collaboration_members
CREATE TABLE IF NOT EXISTS publication_collaboration_members (
  id BIGSERIAL PRIMARY KEY,
  collaboration_id INTEGER NOT NULL REFERENCES publication_collaborations(id),
  user_id INTEGER NOT NULL REFERENCES users_user(id),
  role VARCHAR(50) NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabel publication_collaboration_invites
CREATE TABLE IF NOT EXISTS publication_collaboration_invites (
  id BIGSERIAL PRIMARY KEY,
  collaboration_id INTEGER NOT NULL REFERENCES publication_collaborations(id),
  inviter_id INTEGER NOT NULL REFERENCES users_user(id),
  invitee_id INTEGER NOT NULL REFERENCES users_user(id),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- 4. Tambah kolom collaboration_id di publication_articles (ini yang bikin 500)
ALTER TABLE publication_articles
ADD COLUMN IF NOT EXISTS collaboration_id INTEGER REFERENCES publication_collaborations(id);

-- 5. Tabel publication_discussions (jika belum ada)
CREATE TABLE IF NOT EXISTS publication_discussions (
  id BIGSERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES publication_articles(id),
  user_id INTEGER NOT NULL REFERENCES users_user(id),
  content TEXT NOT NULL,
  parent_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tabel publication_article_audits (jika belum ada)
CREATE TABLE IF NOT EXISTS publication_article_audits (
  id BIGSERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES publication_articles(id),
  user_id INTEGER NOT NULL REFERENCES users_user(id),
  change_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
