"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const auth_1 = require("../../middleware/auth");
const notificationsModule = new hono_1.Hono();
notificationsModule.use('*', auth_1.authMiddleware);
notificationsModule.get('/', async (c) => {
    const currentUser = c.get('user');
    const items = await db_1.db.select()
        .from(schema_1.notifications)
        .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, currentUser.id))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt))
        .limit(20);
    const unreadCountResult = await db_1.db.select({ value: (0, drizzle_orm_1.count)() })
        .from(schema_1.notifications)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.userId, currentUser.id), (0, drizzle_orm_1.eq)(schema_1.notifications.isRead, false)));
    return c.json({
        data: items,
        unreadCount: unreadCountResult[0].value
    });
});
notificationsModule.put('/:id/read', async (c) => {
    const currentUser = c.get('user');
    const id = Number(c.req.param('id'));
    await db_1.db.update(schema_1.notifications)
        .set({ isRead: true })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.notifications.id, id), (0, drizzle_orm_1.eq)(schema_1.notifications.userId, currentUser.id)));
    return c.json({ message: 'Marked as read' });
});
notificationsModule.put('/read-all', async (c) => {
    const currentUser = c.get('user');
    await db_1.db.update(schema_1.notifications)
        .set({ isRead: true })
        .where((0, drizzle_orm_1.eq)(schema_1.notifications.userId, currentUser.id));
    return c.json({ message: 'All marked as read' });
});
notificationsModule.post('/', async (c) => {
    const currentUser = c.get('user');
    const body = await c.req.json();
    await db_1.db.insert(schema_1.notifications).values({
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
exports.default = notificationsModule;
