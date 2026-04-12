import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
export interface AuthUser {
  id: number;
  username: string;
  role: string;
}
declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthUser;
    c.set('user', decoded);
    await next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
};
export const adminMiddleware = async (c: Context, next: Next) => {
  let user = c.get('user');
  if (!user) {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, getJwtSecret()) as AuthUser;
      c.set('user', decoded);
      user = decoded;
    } catch (err) {
      console.error('Admin Middleware Auth Error:', err);
      return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
  }
  if (user.role !== 'superadmin' && user.role !== 'petugaspendaftaran') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }
  await next();
};