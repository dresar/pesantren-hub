"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const auth_1 = require("../../middleware/auth");
const usersModule = new hono_1.Hono();
usersModule.use('*', auth_1.authMiddleware);
usersModule.put('/me', async (c) => {
    const currentUser = c.get('user');
    const body = await c.req.json();
    delete body.password;
    delete body.role;
    delete body.isSuperuser;
    await db_1.db.update(schema_1.users).set(body).where((0, drizzle_orm_1.eq)(schema_1.users.id, currentUser.id));
    return c.json({ message: 'Profile updated' });
});
usersModule.put('/me/notification-seen', async (c) => {
    const currentUser = c.get('user');
    await db_1.db.update(schema_1.users).set({ isNotificationSeen: true }).where((0, drizzle_orm_1.eq)(schema_1.users.id, currentUser.id));
    return c.json({ success: true });
});
usersModule.put('/me/password', async (c) => {
    const currentUser = c.get('user');
    const { currentPassword, newPassword } = await c.req.json();
    if (!currentPassword || !newPassword) {
        return c.json({ error: 'Password lama dan baru harus diisi' }, 400);
    }
    const user = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.id, currentUser.id),
    });
    if (!user) {
        return c.json({ error: 'User tidak ditemukan' }, 404);
    }
    const validPassword = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!validPassword) {
        return c.json({ error: 'Password lama salah' }, 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    await db_1.db.update(schema_1.users)
        .set({ password: hashedPassword, updatedAt: new Date().toISOString() })
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, currentUser.id));
    return c.json({ message: 'Password berhasil diperbarui' });
});
usersModule.get('/me', async (c) => {
    const currentUser = c.get('user');
    const user = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.id, currentUser.id),
        columns: { password: false },
    });
    if (!user)
        return c.json({ error: 'User not found' }, 404);
    const daysSinceJoined = Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24));
    const successfulLogins = await db_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
        .from(schema_1.loginHistory)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.loginHistory.userId, user.id), (0, drizzle_orm_1.eq)(schema_1.loginHistory.status, 'success')))
        .then(res => res[0].count);
    return c.json({ user, stats: { daysSinceJoined, successfulLogins } });
});
exports.default = usersModule;
