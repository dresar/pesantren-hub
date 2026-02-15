import { Hono } from 'hono';
import { eq, desc, and, count } from 'drizzle-orm';
import { db } from '../../db';
import { notifications } from '../../db/schema';
import { authMiddleware, AuthUser } from '../../middleware/auth';
const notificationsModule = new Hono();
notificationsModule.use('*', authMiddleware);
notificationsModule.get('/', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  const items = await db.select()
    .from(notifications)
    .where(eq(notifications.userId, currentUser.id))
    .orderBy(desc(notifications.createdAt))
    .limit(20);
  const unreadCountResult = await db.select({ value: count() })
    .from(notifications)
    .where(and(
      eq(notifications.userId, currentUser.id),
      eq(notifications.isRead, false)
    ));
  return c.json({ 
    data: items,
    unreadCount: unreadCountResult[0].value 
  });
});
notificationsModule.put('/:id/read', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  const id = Number(c.req.param('id'));
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(
      eq(notifications.id, id),
      eq(notifications.userId, currentUser.id)
    ));
  return c.json({ message: 'Marked as read' });
});
notificationsModule.put('/read-all', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, currentUser.id));
  return c.json({ message: 'All marked as read' });
});
notificationsModule.post('/', async (c) => {
  const currentUser = c.get('user') as AuthUser;
  const body = await c.req.json();
  await db.insert(notifications).values({
    userId: currentUser.id,
    title: body.title,
    message: body.message,
    type: body.type || 'info',
    createdAt: new Date().toISOString(),
    isRead: false,
    actionUrl: body.actionUrl
  });
  return c.json({ message: 'Notification created' }, 201);
});
export default notificationsModule;