import { Hono } from 'hono';
import { eq, sql, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { users, loginHistory } from '../../db/schema';
import { authMiddleware, AuthUser } from '../../middleware/auth';
const usersModule = new Hono();
usersModule.use('*', authMiddleware);
usersModule.put('/me', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  const body = await c.req.json();
  delete body.password;
  delete body.role;
  delete body.isSuperuser;
  await db.update(users).set(body).where(eq(users.id, currentUser.id));
  return c.json({ message: 'Profile updated' });
});

usersModule.put('/me/notification-seen', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  await db.update(users).set({ isNotificationSeen: true }).where(eq(users.id, currentUser.id));
  return c.json({ success: true });
});

usersModule.put('/me/password', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  const { currentPassword, newPassword } = await c.req.json();
  if (!currentPassword || !newPassword) {
    return c.json({ error: 'Password lama dan baru harus diisi' }, 400);
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, currentUser.id),
  });
  if (!user) {
    return c.json({ error: 'User tidak ditemukan' }, 404);
  }
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return c.json({ error: 'Password lama salah' }, 400);
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.update(users)
    .set({ password: hashedPassword, updatedAt: new Date().toISOString() })
    .where(eq(users.id, currentUser.id));
  return c.json({ message: 'Password berhasil diperbarui' });
});
usersModule.get('/me', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  const user = await db.query.users.findFirst({
    where: eq(users.id, currentUser.id),
    columns: { password: false },
  });
  if (!user) return c.json({ error: 'User not found' }, 404);
  const daysSinceJoined = Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24));
  const successfulLogins = await db.select({ count: sql<number>`count(*)` })
    .from(loginHistory)
    .where(and(eq(loginHistory.userId, user.id), eq(loginHistory.status, 'success')))
    .then(res => res[0].count);
  return c.json({ user, stats: { daysSinceJoined, successfulLogins } });
});
export default usersModule;