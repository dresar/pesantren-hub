import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { mediaService } from '../media/media.service';

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_UPLOADS_PER_WINDOW = 20; // 20 uploads per minute

const upload = new Hono();

upload.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const userId = user.id;
    const userKey = `user:${userId}`;

    // Rate Limiting Logic
    const now = Date.now();
    const record = rateLimiter.get(userKey) || { count: 0, lastReset: now };

    if (now - record.lastReset > RATE_LIMIT_WINDOW) {
      record.count = 0;
      record.lastReset = now;
    }

    if (record.count >= MAX_UPLOADS_PER_WINDOW) {
      return c.json({ error: 'Rate limit exceeded. Please try again later.' }, 429);
    }

    record.count++;
    rateLimiter.set(userKey, record);

    const body = await c.req.parseBody();
    const file = body['file'];

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

    // Use mediaService to upload to cloud
    // Default to 'general' category and root folder if not specified
    const result = await mediaService.processUpload(fileBuffer, metadata, {
      category: 'general',
      folder: '/',
      userId: c.get('user').id
    });

    return c.json({
      message: 'File uploaded successfully',
      url: result.url, // Return cloud URL
      filename: result.originalName,
      fileId: result.id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

export default upload;