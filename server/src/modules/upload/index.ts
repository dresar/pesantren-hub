import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { mediaService } from '../media/media.service';

// ──────────────────────────────────────────────────────────────────────────────
// RATE LIMITING REMOVED — In-memory Map() is an anti-pattern in serverless:
//   - State resets on every cold start
//   - Each Vercel instance has its own isolated memory (no shared state)
//   - Causes memory leaks with long-running warm instances
//
// TODO: Implement proper distributed rate limiting via:
//   - Vercel KV (built-in): https://vercel.com/docs/storage/vercel-kv
//   - Upstash Redis (free tier available): https://upstash.com
//   - Example: const ratelimit = new Ratelimit({ redis: kv, limiter: Ratelimit.slidingWindow(20, '60 s') })
// ──────────────────────────────────────────────────────────────────────────────

const upload = new Hono();

upload.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');

    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file uploaded or invalid format' }, 400);
    }

    // ── Vercel Free Tier: 4.5MB request body limit ──
    // Reject early if file exceeds the limit to avoid wasting execution time
    const MAX_VERCEL_BODY_SIZE = 4.5 * 1024 * 1024; // 4.5MB
    if (file.size > MAX_VERCEL_BODY_SIZE) {
      return c.json({ 
        error: `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Vercel limit is 4.5MB.`,
        suggestion: 'Use presigned URL uploads for large files.' 
      }, 413);
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
      userId: user.id
    });

    return c.json({
      message: 'File uploaded successfully',
      url: result.url, // Return cloud URL
      filename: result.name,
      fileId: result.id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// PRESIGNED URL STRATEGY (Recommended for production):
//
// For files > 4.5MB, implement direct client-to-cloud uploads:
//
// 1. Client requests a presigned URL from this API:
//    POST /api/upload/presign → { url, fields, fileId }
//
// 2. Client uploads directly to cloud storage (S3/Cloudinary/ImageKit)
//    using the presigned URL — bypasses Vercel entirely.
//
// 3. Client notifies this API of completion:
//    POST /api/upload/confirm → { fileId, status }
//
// This eliminates the 4.5MB body limit and reduces serverless execution time.
// ──────────────────────────────────────────────────────────────────────────────

export default upload;