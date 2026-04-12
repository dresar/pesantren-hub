import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { mediaService } from './media.service';
import { 
    uploadFileRequestSchema, 
    listFilesQuerySchema, 
    insertMediaAccountSchema, 
    listAccountsQuerySchema 
} from './media.schema';
import { authMiddleware } from '../../middleware/auth';

const media = new Hono();

// --- Media Files ---

media.post('/upload', authMiddleware, async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'];
        
        // Detailed logging for debugging
        console.log('Upload Request Body Keys:', Object.keys(body));
        if (file instanceof File) {
            console.log('File details:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
        } else {
            console.error('File is not a File instance:', file);
        }

        if (!file || !(file instanceof File)) {
            return c.json({ error: 'No file uploaded or invalid format' }, 400);
        }

        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        // Extract metadata
        const metadata = {
            filename: file.name,
            mimetype: file.type,
            size: file.size,
        };

        // Extract options
        // Note: Hono parseBody returns strings for non-file fields
        const options = {
            category: body['category'] as string || 'general',
            folder: body['folder'] as string || '/',
            tags: body['tags'] as string || '',
            userId: c.get('user').id,
            provider: body['provider'] as string || undefined
        };

        const result = await mediaService.processUpload(fileBuffer, metadata, options);
        return c.json(result, 201);
    } catch (error) {
        console.error('Upload endpoint error:', error);
        // Return detailed error message to client
        return c.json({ 
            error: 'Failed to upload file', 
            details: error instanceof Error ? error.message : String(error) 
        }, 500);
    }
});

media.get('/files', authMiddleware, zValidator('query', listFilesQuerySchema), async (c) => {
    const query = c.req.valid('query');
    try {
        const result = await mediaService.listFiles(query);
        return c.json(result);
    } catch (error) {
        return c.json({ error: 'Failed to list files' }, 500);
    }
});

media.delete('/files/:id', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

    try {
        await mediaService.deleteFile(id, c.get('user').id);
        return c.json({ message: 'File deleted' });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : 'Failed to delete file' }, 500);
    }
});

media.post('/files/bulk-delete', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        const ids = body.ids;
        if (!Array.isArray(ids)) return c.json({ error: 'Invalid body, expected { ids: number[] }' }, 400);
        
        const result = await mediaService.bulkDeleteFiles(ids, c.get('user').id);
        return c.json(result);
    } catch (error) {
        return c.json({ error: 'Failed to delete files' }, 500);
    }
});

// --- Media Accounts (Admin Only - TODO: Add Role Check) ---

media.post('/accounts', authMiddleware, zValidator('json', insertMediaAccountSchema), async (c) => {
    const data = c.req.valid('json');
    try {
        const account = await mediaService.createAccount(data as any);
        return c.json(account, 201);
    } catch (error) {
        const err: any = error;
        console.error('Create account error:', error);
        if (err?.code === '42703' || (err?.code === '23502' && String(err?.detail || '').includes('cloud_name'))) {
            await mediaService.ensureMediaAccountsSchema();
            try {
                const retry = await mediaService.createAccount(data as any);
                return c.json(retry, 201);
            } catch (e2) {
                console.error('Retry create account error:', e2);
            }
        }
        return c.json({ error: error instanceof Error ? error.message : 'Failed to create account' }, 500);
    }
});

media.post('/accounts/import', authMiddleware, async (c) => {
    try {
        const ct = c.req.header('content-type') || '';
        if (ct.includes('multipart/form-data')) {
            const body = await c.req.parseBody();
            const file = body['file'];
            if (!file || !(file instanceof File)) {
                return c.json({ error: 'File tidak valid' }, 400);
            }
            const buf = Buffer.from(await (file as File).arrayBuffer());
            const json = JSON.parse(buf.toString('utf-8'));
            if (!Array.isArray(json)) {
                return c.json({ error: 'Format JSON tidak valid (harus array)' }, 400);
            }
            const result = await mediaService.importAccounts(json);
            return c.json(result);
        } else {
            const body = await c.req.json().catch(() => ({}));
            const path = body.path as string | undefined;
            if (!path) {
                return c.json({ error: 'Path tidak diberikan' }, 400);
            }
            const result = await mediaService.importAccountsFromPath(path);
            return c.json(result);
        }
    } catch (error) {
        console.error('Import accounts error:', error);
        return c.json({ error: error instanceof Error ? error.message : 'Gagal import akun' }, 500);
    }
});

media.get('/accounts', authMiddleware, zValidator('query', listAccountsQuerySchema), async (c) => {
    const query = c.req.valid('query');
    try {
        const accounts = await mediaService.listAccounts(query);
        return c.json(accounts);
    } catch (error) {
        const err: any = error;
        const msg = String(err?.message || '');
        if (err?.code === '42P01' || msg.includes('media_accounts') && msg.includes('does not exist')) {
            console.warn('media_accounts table missing, returning empty list');
            return c.json([]);
        }
        console.error('List accounts error:', error);
        return c.json({ error: 'Failed to list accounts' }, 500);
    }
});

media.put('/accounts/:id', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

    try {
        const body = await c.req.json();
        // Prevent updating sensitive fields if needed, but here we want to allow updating credentials
        // Basic validation
        const account = await mediaService.updateAccount(id, body);
        if (!account) return c.json({ error: 'Account not found' }, 404);
        return c.json(account);
    } catch (error) {
        console.error('Update account error:', error);
        return c.json({ error: error instanceof Error ? error.message : 'Failed to update account' }, 500);
    }
});

media.delete('/accounts/:id', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    const force = c.req.query('force') === 'true';
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

    try {
        if (force) {
            await mediaService.forceDeleteAccount(id);
        } else {
            await mediaService.deleteAccount(id);
        }
        return c.json({ message: 'Account deleted' });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : 'Failed to delete account' }, 500);
    }
});

media.post('/accounts/reorder', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        // Basic validation: body should be array of { id, order }
        if (!Array.isArray(body)) return c.json({ error: 'Invalid body' }, 400);
        
        await mediaService.reorderAccounts(body);
        return c.json({ message: 'Accounts reordered' });
    } catch (error) {
        return c.json({ error: 'Failed to reorder accounts' }, 500);
    }
});

media.post('/accounts/:id/restore', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

    try {
        await mediaService.restoreAccount(id);
        return c.json({ message: 'Account restored' });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : 'Failed to restore account' }, 500);
    }
});

media.post('/accounts/:id/sync', authMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

    try {
        const result = await mediaService.syncAccountUsage(id);
        return c.json(result);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : 'Failed to sync account' }, 500);
    }
});

// --- Media Settings ---

media.get('/settings', authMiddleware, async (c) => {
    try {
        const settings = await mediaService.getSettings();
        return c.json(settings);
    } catch (error) {
        console.error('Fetch settings error:', error);
        return c.json({ error: 'Failed to fetch settings' }, 500);
    }
});

media.put('/settings', authMiddleware, async (c) => {
    try {
        const body = await c.req.json();
        // Basic validation could be added here
        const settings = await mediaService.updateSettings(body);
        return c.json(settings);
    } catch (error) {
        console.error('Settings update error:', error);
        return c.json({ error: 'Failed to update settings' }, 500);
    }
});

export default media;
