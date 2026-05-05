"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const db_1 = require("../../db");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const cache_1 = require("../../utils/cache");
const adminGeneric = new hono_1.Hono();
const getTable = (name) => {
    const mapping = {
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
        dokumentasiimage: 'dokumentasiImages',
        dokumentasiImage: 'dokumentasiImages',
        dokumentasiImages: 'dokumentasiImages',
        dokumentasi_images: 'dokumentasiImages',
        dokumentasi_image: 'dokumentasiImages',
    };
    const schemaName = mapping[name] || name;
    if (schema[schemaName]) {
        return schema[schemaName];
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
        const data = await db_1.db.select().from(table);
        return c.json({ data });
    }
    catch (error) {
        console.error(`Error fetching ${resource}:`, error);
        const message = error?.message || 'Internal Server Error';
        return c.json({ error: 'Internal Server Error', message }, 500);
    }
});
adminGeneric.get('/:resource/:id', async (c) => {
    const resource = c.req.param('resource');
    const id = Number(c.req.param('id'));
    const table = getTable(resource);
    if (!table)
        return c.json({ error: 'Resource not found' }, 404);
    const result = await db_1.db.select().from(table).where((0, drizzle_orm_1.eq)(table.id, id));
    if (result.length === 0) {
        return c.json({ error: 'Item not found' }, 404);
    }
    return c.json({ data: result[0] });
});
adminGeneric.post('/:resource', async (c) => {
    const resource = c.req.param('resource');
    const table = getTable(resource);
    if (!table)
        return c.json({ error: 'Resource not found' }, 404);
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
            const existing = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema.statistik);
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
            if (body.jumlah != null)
                body.jumlah = Number(body.jumlah);
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
        if ('order' in (0, drizzle_orm_1.getTableColumns)(table)) {
            if (body.order === undefined || body.order === null || body.order === '') {
                body.order = 0;
            }
            else {
                body.order = Number(body.order);
            }
        }
        // Generic createdAt fallback
        if (!body.createdAt && 'createdAt' in (0, drizzle_orm_1.getTableColumns)(table)) {
            body.createdAt = new Date().toISOString();
        }
        if (!body.updatedAt && 'updatedAt' in (0, drizzle_orm_1.getTableColumns)(table)) {
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
        await db_1.db.insert(table).values(body);
        cache_1.cache.del(`generic:${resource}`);
        return c.json({ message: 'Created' }, 201);
    }
    catch (error) {
        console.error(`Error creating ${resource}:`, error);
        return c.json({ error: 'Internal Server Error', details: error.message }, 500);
    }
});
adminGeneric.put('/:resource/:id', async (c) => {
    const resource = c.req.param('resource');
    const id = Number(c.req.param('id'));
    const table = getTable(resource);
    if (!table)
        return c.json({ error: 'Resource not found' }, 404);
    const body = await c.req.json();
    const cleanBody = {};
    try {
        const columns = (0, drizzle_orm_1.getTableColumns)(table);
        for (const key of Object.keys(body)) {
            if (Object.prototype.hasOwnProperty.call(columns, key)) {
                cleanBody[key] = body[key];
            }
        }
    }
    catch (error) {
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
        await db_1.db.update(table).set(cleanBody).where((0, drizzle_orm_1.eq)(table.id, id));
        cache_1.cache.del(`generic:${resource}`);
        return c.json({ message: 'Updated' });
    }
    catch (error) {
        console.error(`Error updating ${resource}:`, error);
        return c.json({ error: 'Failed to update', details: error.message }, 500);
    }
});
adminGeneric.delete('/:resource/:id', async (c) => {
    const resource = c.req.param('resource');
    const id = Number(c.req.param('id'));
    const table = getTable(resource);
    if (!table)
        return c.json({ error: 'Resource not found' }, 404);
    await db_1.db.delete(table).where((0, drizzle_orm_1.eq)(table.id, id));
    cache_1.cache.del(`generic:${resource}`);
    return c.json({ message: 'Deleted' });
});
adminGeneric.post('/:resource/bulk-delete', async (c) => {
    const resource = c.req.param('resource');
    const table = getTable(resource);
    if (!table)
        return c.json({ error: 'Resource not found' }, 404);
    const body = await c.req.json();
    const ids = body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
        return c.json({ error: 'No IDs provided' }, 400);
    }
    await db_1.db.delete(table).where((0, drizzle_orm_1.inArray)(table.id, ids));
    cache_1.cache.del(`generic:${resource}`);
    return c.json({ message: 'Bulk deleted successfully', count: ids.length });
});
exports.default = adminGeneric;
