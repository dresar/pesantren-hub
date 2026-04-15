import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import auth from './modules/auth';
import admin from './modules/admin';
import users from './modules/users';
import payments from './modules/payments';
import admissions from './modules/admissions';
import blog from './modules/blog';
import core from './modules/core';
import upload from './modules/upload';
import notifications from './modules/notifications';
import santri from './modules/santri';
import media from './modules/media';
import { publication } from './modules/publication';

const app = new Hono();

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use('*', logger());
app.use('*', cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use('*', prettyJSON());

// ── Global Error Handler ──────────────────────────────────────────────────────
app.onError((err, c) => {
  console.error('[API ERROR]:', err);
  
  // Check for common DB errors
  const isDbError = err?.name === 'NeonDbError' || err?.message?.toLowerCase().includes('database') || (err as any)?.code?.startsWith('57');
  
  if (isDbError) {
    console.error('CRITICAL: Database connection issue detected.');
  }

  return c.json({
    error: err?.message || 'Internal Server Error',
    message: (err as any)?.code ? `Code: ${(err as any).code}` : undefined,
    name: err?.name,
    stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined,
    path: c.req.path,
    timestamp: new Date().toISOString(),
  }, 500);
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.json({
    message: 'Pesantren Hub API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', uptime: process.uptime() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.route('/api/auth', auth);
app.route('/api/admin', admin);
app.route('/api/users', users);
app.route('/api/payments', payments);
app.route('/api/psb', admissions);
app.route('/api/blog', blog);
app.route('/api/core', core);
app.route('/api/upload', upload);
app.route('/api/media', media);
app.route('/api/notifications', notifications);
app.route('/api/santri', santri);
app.route('/api/publication', publication);

// Export for serverless handle
export default app;
