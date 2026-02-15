import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
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
app.use('/uploads/*', serveStatic({ root: './' }));
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
app.route('/api/notifications', notifications);
app.route('/api/santri', santri);
const port = parseInt(process.env.PORT || '3000');
console.log(`Pesantren Hub unified server listening on ${port}`);
serve({
  fetch: app.fetch,
  port,
});
export default app;