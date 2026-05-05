"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorMiddleware = exports.authorMiddleware = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const authorMiddleware = async (c, next) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    // Check verification status from DB (fresh check)
    // Superadmin bypass verification
    if (user.role === 'superadmin') {
        await next();
        return;
    }
    const dbUser = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.id, user.id),
        columns: {
            isVerified: true,
            verificationStatus: true,
            publicationRole: true,
            publicationStatus: true,
            publicationVerified: true
        }
    });
    // Check if user has author role OR publication role
    const isAuthor = user.role === 'author' || dbUser?.publicationRole === 'author';
    if (!isAuthor && !['editor', 'reviewer'].includes(user.role)) {
        return c.json({ error: 'Forbidden: Author access required' }, 403);
    }
    // Use publicationVerified if available, otherwise fallback to legacy isVerified
    const isVerified = dbUser?.publicationVerified || dbUser?.isVerified;
    const status = dbUser?.publicationStatus !== 'none' ? dbUser?.publicationStatus : dbUser?.verificationStatus;
    if (!dbUser || !isVerified) {
        return c.json({
            error: 'Forbidden: Account not verified',
            status: status
        }, 403);
    }
    await next();
};
exports.authorMiddleware = authorMiddleware;
const editorMiddleware = async (c, next) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const allowedRoles = ['editor', 'superadmin'];
    if (!allowedRoles.includes(user.role)) {
        return c.json({ error: 'Forbidden: Editor access required' }, 403);
    }
    await next();
};
exports.editorMiddleware = editorMiddleware;
