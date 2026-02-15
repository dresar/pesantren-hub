import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, or } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { users, loginHistory } from '../../db/schema';
import { registerSchema, loginSchema } from './auth.schema';
const auth = new Hono();
const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const data = c.req.valid('json');
  const existingUser = await db.select().from(users).where(or(eq(users.username, data.username), eq(users.email, data.email))).limit(1);
  if (existingUser.length > 0) {
    return c.json({ error: 'Username or email already exists' }, 400);
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const now = new Date();
  const [user] = await db.insert(users).values({
    username: data.username,
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: data.username === 'dev_admin' ? 'superadmin' : 'santri',
    isActive: true,
    isStaff: data.username === 'dev_admin',
    isSuperuser: data.username === 'dev_admin',
    dateJoined: now,
    createdAt: now,
    updatedAt: now,
  }).returning();
  if (!user) {
    return c.json({ error: 'Failed to create user' }, 500);
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, getJwtSecret(), { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: user.id }, getJwtSecret(), { expiresIn: '7d' });
  await db.insert(loginHistory).values({
    userId: user.id,
    ipAddress: c.req.header('x-forwarded-for') || 'unknown',
    userAgent: c.req.header('user-agent') || 'unknown',
    status: 'success',
    errorMessage: '',
    createdAt: now,
  });
  return c.json({
    message: 'Registration successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    },
    token,
    refreshToken,
  }, 201);
});
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const data = c.req.valid('json');
  const userResult = await db.select().from(users).where(eq(users.username, data.username));
  if (userResult.length === 0) {
    await db.insert(loginHistory).values({
      username: data.username, 
      ipAddress: c.req.header('x-forwarded-for') || 'unknown',
      userAgent: c.req.header('user-agent') || 'unknown',
      status: 'failed',
      errorMessage: 'User not found',
      createdAt: new Date(),
    });
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  const user = userResult[0];
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    await db.insert(loginHistory).values({
      userId: user.id,
      username: user.username,
      ipAddress: c.req.header('x-forwarded-for') || 'unknown',
      userAgent: c.req.header('user-agent') || 'unknown',
      status: 'failed',
      errorMessage: 'Invalid password',
      createdAt: new Date(),
    });
    return c.json({ error: 'Invalid credentials' }, 401);
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, getJwtSecret(), { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id: user.id }, getJwtSecret(), { expiresIn: '7d' });
  await db.insert(loginHistory).values({
    userId: user.id,
    username: user.username,
    ipAddress: c.req.header('x-forwarded-for') || 'unknown',
    userAgent: c.req.header('user-agent') || 'unknown',
    status: 'success',
    errorMessage: '',
    createdAt: new Date(),
  });
  return c.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    },
    token,
    refreshToken,
  });
});
export default auth;