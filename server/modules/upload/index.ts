import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
const upload = new Hono();
const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}
upload.post('/', authMiddleware, async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];
  if (!file || typeof file === 'string') {
    return c.json({ error: 'No file uploaded' }, 400);
  }
  if (file instanceof File) {
    const buffer = await file.arrayBuffer();
    const ext = extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, Buffer.from(buffer));
    const fileUrl = `/uploads/${filename}`;
    return c.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: filename,
    });
  }
  return c.json({ error: 'Invalid file upload' }, 400);
});
export default upload;