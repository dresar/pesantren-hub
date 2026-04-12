import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { createAdaptorServer } from '@hono/node-server';
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
import { startWsServer } from './ws';

const app = new Hono();
app.use('*', logger());
app.use('*', cors());
app.use('*', prettyJSON());
app.onError((err, c) => {
  console.error('Unhandled Error:', err);
  return c.json({
    error: err?.message || 'Internal Server Error',
    name: err?.name,
    stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined,
    path: c.req.path,
  }, 500);
});

app.get('/', (c) => {
  return c.json({
    message: 'Pesantren Hub API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

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

const port = parseInt(process.env.PORT || '3008', 10);

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const server = createAdaptorServer({ fetch: app.fetch });
  startWsServer(server);
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[ERROR] Port ${port} sudah dipakai.`);
      console.error('Tutup proses lain yang memakai port ini, atau ubah PORT di file .env (misal 3009).');
      console.error('Windows: netstat -ano | findstr :' + port);
      process.exit(1);
    }
    throw err;
  });
  server.listen(port, () => {
    console.log(`Pesantren Hub unified server listening on ${port}`);
  });
}

export default app;
