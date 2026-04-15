import { Hono } from 'hono';
import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq, sql, inArray, getTableColumns } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { cache } from '../../utils/cache';

const adminGeneric = new Hono();

const getTable = (name: string) => {
  const mapping: Record<string, string> = {
    blogBlogpost: 'blogPosts',
    blogCategory: 'blogCategories',
    blogTag: 'blogTags',
    blogPengumuman: 'blogAnnouncements',
    blogTestimoni: 'blogTestimonials',
    systemSettings: 'systemSettings',
    documentSettings: 'documentSettings',
    documentTemplates: 'documentTemplates',
    websiteSettings: 'websiteSettings',
    registrationFlow: 'websiteRegistrationFlow',
  };
  const schemaName = mapping[name] || name;
  if (schema[schemaName as keyof typeof schema]) {
    return schema[schemaName as keyof typeof schema] as PgTable;
  }
  return null;
};
adminGeneric.get('/:resource', async (c) => {
  const resource = c.req.param('resource');
  const table = getTable(resource);
  if (!table) {
    console.error(`Table not found for resource: ${resource}`);
    return c.json({ error: 'Resource not found' }, 404);
  }
  try {
    const data = await db.select().from(table);
    return c.json({ data });
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    const message = (error as any)?.message || 'Internal Server Error';
    return c.json({ error: 'Internal Server Error', message }, 500);
  }
});
adminGeneric.get('/:resource/:id', async (c) => {
  const resource = c.req.param('resource');
  const id = Number(c.req.param('id'));
  const table = getTable(resource);
  if (!table) return c.json({ error: 'Resource not found' }, 404);
  const result = await db.select().from(table).where(eq((table as any).id, id));
  if (result.length === 0) {
    return c.json({ error: 'Item not found' }, 404);
  }
  return c.json({ data: result[0] });
});
  adminGeneric.post('/:resource', async (c) => {
  const resource = c.req.param('resource');
  const table = getTable(resource);
  if (!table) return c.json({ error: 'Resource not found' }, 404);
  
  try {
    const body = await c.req.json();
    
    // Auto-fill required fields if missing
    if (resource === 'blogTestimoni') {
      body.createdAt = body.createdAt || new Date().toISOString();
      body.isPublished = body.isPublished ?? true;
      body.order = body.order ?? 0;
      body.rating = body.rating ? Number(body.rating) : 5;
    }

    if (resource === 'faq') {
      body.createdAt = body.createdAt || new Date().toISOString();
      body.isPublished = body.isPublished ?? true;
      body.order = body.order ?? 0;
      body.kategori = body.kategori || 'Umum';
    }
    
    if (resource === 'statistik') {
      const existing = await db.select({ count: sql<number>`count(*)` }).from(schema.statistik);
      if (Number(existing[0]?.count) >= 4) {
        return c.json({ error: 'Maksimal 4 entri statistik diperbolehkan' }, 400);
      }
      body.createdAt = body.createdAt || new Date().toISOString();
      body.isPublished = body.isPublished ?? body.isActive ?? true;
      body.order = body.order ?? 0;
    }
    
    if (resource === 'biayaPendidikan') {
      body.createdAt = body.createdAt || new Date().toISOString();
      body.order = body.order ?? 0;
      if (body.jumlah != null) body.jumlah = Number(body.jumlah);
    }
    
    if (resource === 'registrationFlow') {
      body.isActive = body.isActive ?? true;
      body.order = body.order ?? 0;
    }

    if (resource === 'tenagaPengajar') {
      // Handle empty strings for optional fields
      const optionalFields = [
        'namaPanggilan', 'tempatLahir', 'tanggalLahir', 'alamat', 
        'email', 'pendidikanTerakhir', 'universitas', 'tahunLulus',
        'bidangKeahlian', 'mataPelajaran', 'pengalamanMengajar', 'prestasi',
        'riwayatPendidikan', 'organisasi', 'karyaTulis', 'motto',
        'whatsapp', 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok',
        'foto', 'jabatan'
      ];

      optionalFields.forEach(field => {
        if (body[field] === '') {
          body[field] = null;
        }
      });
      
      // Ensure order is number
      body.order = body.order ?? 0;
      body.isPublished = body.isPublished ?? true;
      body.isFeatured = body.isFeatured ?? false;
    }
    
    // Generic order fallback
    if ('order' in getTableColumns(table)) {
        if (body.order === undefined || body.order === null || body.order === '') {
            body.order = 0;
        } else {
            body.order = Number(body.order);
        }
    }

    // Generic createdAt fallback
    if (!body.createdAt && 'createdAt' in getTableColumns(table)) {
        body.createdAt = new Date().toISOString();
    }
    if (!body.updatedAt && 'updatedAt' in getTableColumns(table)) {
        body.updatedAt = new Date().toISOString();
    }

    // Convert empty string date to null
    Object.keys(body).forEach(key => {
        if (key.toLowerCase().includes('tanggal') || key.toLowerCase().includes('date')) {
            if (body[key] === '') {
                body[key] = null;
            }
        }
    });

    await db.insert(table).values(body);
    cache.del(`generic:${resource}`);
    return c.json({ message: 'Created' }, 201);
  } catch (error: any) {
    console.error(`Error creating ${resource}:`, error);
    return c.json({ error: 'Internal Server Error', details: error.message }, 500);
  }
});
  adminGeneric.put('/:resource/:id', async (c) => {
  const resource = c.req.param('resource');
  const id = Number(c.req.param('id'));
  const table = getTable(resource);
  if (!table) return c.json({ error: 'Resource not found' }, 404);
  const body = await c.req.json();
  const cleanBody: Record<string, any> = {};
  try {
    const columns = getTableColumns(table);
    for (const key of Object.keys(body)) {
      if (Object.prototype.hasOwnProperty.call(columns, key)) {
         cleanBody[key] = body[key];
      }
    }
  } catch (error) {
    console.error('Error filtering columns:', error);
    return c.json({ error: 'Failed to process request' }, 500);
  }
  delete cleanBody.id;
  delete cleanBody.createdAt;
  delete cleanBody.updatedAt;
  if (Object.keys(cleanBody).length === 0) {
    return c.json({ message: 'No valid fields to update' });
  }
  try {
    await db.update(table).set(cleanBody).where(eq((table as any).id, id)); 
    cache.del(`generic:${resource}`);
    return c.json({ message: 'Updated' });
  } catch (error: any) {
    console.error(`Error updating ${resource}:`, error);
    return c.json({ error: 'Failed to update', details: error.message }, 500);
  }
});
adminGeneric.delete('/:resource/:id', async (c) => {
  const resource = c.req.param('resource');
  const id = Number(c.req.param('id'));
  const table = getTable(resource);
  if (!table) return c.json({ error: 'Resource not found' }, 404);
  await db.delete(table).where(eq((table as any).id, id)); 
  cache.del(`generic:${resource}`);
  return c.json({ message: 'Deleted' });
});
adminGeneric.post('/:resource/bulk-delete', async (c) => {
  const resource = c.req.param('resource');
  const table = getTable(resource);
  if (!table) return c.json({ error: 'Resource not found' }, 404);
  const body = await c.req.json();
  const ids = body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return c.json({ error: 'No IDs provided' }, 400);
  }
  await db.delete(table).where(inArray((table as any).id, ids));
  cache.del(`generic:${resource}`);
  return c.json({ message: 'Bulk deleted successfully', count: ids.length });
});
export default adminGeneric;
