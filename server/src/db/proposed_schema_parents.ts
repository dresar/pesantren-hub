import { pgTable, serial, varchar, text, integer, boolean, timestamp, date, bigserial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { santri } from './schema';

/**
 * PROPOSED DATA MODEL FOR PARENTS / GUARDIANS
 * 
 * Current Issue:
 * Parent data is denormalized within the 'admissions_santri' table.
 * This leads to redundancy if multiple siblings are registered (parent data repeated).
 * 
 * Proposed Solution:
 * Extract parent data into a separate 'admissions_parents' table.
 * Link parents to santri via a junction table 'admissions_santri_parents' or direct foreign keys if simplified.
 * 
 * Benefits:
 * - No data redundancy.
 * - Single update for parent details reflects on all children.
 * - Support for complex family structures (step-parents, guardians).
 */

export const parents = pgTable('admissions_parents', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  
  // Identity
  nik: varchar('nik', { length: 16 }).notNull().unique(), // Unique identifier
  namaLengkap: varchar('nama_lengkap', { length: 200 }).notNull(),
  
  // Contact
  noHp: varchar('no_hp', { length: 20 }).notNull(),
  email: varchar('email', { length: 254 }),
  alamat: text('alamat').notNull(),
  
  // Demographics
  tempatLahir: varchar('tempat_lahir', { length: 100 }),
  tanggalLahir: date('tanggal_lahir', { mode: 'string' }),
  status: varchar('status', { length: 20 }).notNull().default('Hidup'), // Hidup, Meninggal, Bercerai
  agama: varchar('agama', { length: 20 }),
  kewarganegaraan: varchar('kewarganegaraan', { length: 20 }).default('WNI'),
  
  // Socio-economic
  pendidikanTerakhir: varchar('pendidikan_terakhir', { length: 50 }),
  pekerjaan: varchar('pekerjaan', { length: 100 }),
  penghasilan: varchar('penghasilan', { length: 50 }),
  
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

// Junction table to link Santri and Parents with relationship type
export const santriParents = pgTable('admissions_santri_parents', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  santriId: integer('santri_id').notNull().references(() => santri.id),
  parentId: integer('parent_id').notNull().references(() => parents.id),
  
  // Relationship: 'Ayah Kandung', 'Ibu Kandung', 'Wali', 'Ayah Tiri', etc.
  hubungan: varchar('hubungan', { length: 50 }).notNull(),
  
  isPrimaryContact: boolean('is_primary_contact').default(false),
});

// Relations definitions
export const parentsRelations = relations(parents, ({ many }) => ({
  children: many(santriParents),
}));

export const santriParentsRelations = relations(santriParents, ({ one }) => ({
  santri: one(santri, {
    fields: [santriParents.santriId],
    references: [santri.id],
  }),
  parent: one(parents, {
    fields: [santriParents.parentId],
    references: [parents.id],
  }),
}));
