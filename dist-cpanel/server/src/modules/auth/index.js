"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const auth_schema_1 = require("./auth.schema");
const auth = new hono_1.Hono();
const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
auth.post('/register', (0, zod_validator_1.zValidator)('json', auth_schema_1.registerSchema), async (c) => {
    const data = c.req.valid('json');
    const existingUser = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.users.username, data.username), (0, drizzle_orm_1.eq)(schema_1.users.email, data.email))).limit(1);
    if (existingUser.length > 0) {
        return c.json({ error: 'Username or email already exists' }, 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    const now = new Date().toISOString();
    const [user] = await db_1.db.insert(schema_1.users).values({
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
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, getJwtSecret(), { expiresIn: '1d' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, getJwtSecret(), { expiresIn: '7d' });
    await db_1.db.insert(schema_1.loginHistory).values({
        userId: user.id,
        username: user.username,
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
auth.post('/login', (0, zod_validator_1.zValidator)('json', auth_schema_1.loginSchema), async (c) => {
    const data = c.req.valid('json');
    // Allow login with username OR email (case-insensitive)
    const userResult = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.users.username, data.username), (0, drizzle_orm_1.ilike)(schema_1.users.email, data.username)));
    if (userResult.length === 0) {
        await db_1.db.insert(schema_1.loginHistory).values({
            username: data.username,
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            userAgent: c.req.header('user-agent') || 'unknown',
            status: 'failed',
            errorMessage: 'User not found',
            createdAt: new Date().toISOString(),
        });
        return c.json({ error: 'Username atau password salah' }, 401);
    }
    const user = userResult[0];
    if (!user.isActive) {
        await db_1.db.insert(schema_1.loginHistory).values({
            userId: user.id,
            username: user.username,
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            userAgent: c.req.header('user-agent') || 'unknown',
            status: 'failed',
            errorMessage: 'Account inactive',
            createdAt: new Date().toISOString(),
        });
        return c.json({ error: 'Akun nonaktif. Hubungi administrator.' }, 403);
    }
    const validPassword = await bcryptjs_1.default.compare(data.password, user.password);
    if (!validPassword) {
        await db_1.db.insert(schema_1.loginHistory).values({
            userId: user.id,
            username: user.username,
            ipAddress: c.req.header('x-forwarded-for') || 'unknown',
            userAgent: c.req.header('user-agent') || 'unknown',
            status: 'failed',
            errorMessage: 'Invalid password',
            createdAt: new Date().toISOString(),
        });
        return c.json({ error: 'Username atau password salah' }, 401);
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, getJwtSecret(), { expiresIn: '1d' });
    const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, getJwtSecret(), { expiresIn: '7d' });
    await db_1.db.insert(schema_1.loginHistory).values({
        userId: user.id,
        username: user.username,
        ipAddress: c.req.header('x-forwarded-for') || 'unknown',
        userAgent: c.req.header('user-agent') || 'unknown',
        status: 'success',
        errorMessage: '',
        createdAt: new Date().toISOString(),
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
            isVerified: user.isVerified,
            verificationStatus: user.verificationStatus,
            publicationRole: user.publicationRole,
            publicationStatus: user.publicationStatus,
            isPublicationRegistered: user.isPublicationRegistered,
            publicationVerified: user.publicationVerified,
            rejectedReason: user.rejectedReason,
        },
        token,
        refreshToken,
    });
});
const auth_1 = require("../../middleware/auth");
auth.get('/me', auth_1.authMiddleware, async (c) => {
    const user = c.get('user');
    const dbUser = await db_1.db.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.id, user.id),
    });
    if (!dbUser)
        return c.json({ error: 'User not found' }, 404);
    return c.json({
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        isVerified: dbUser.isVerified,
        verificationStatus: dbUser.verificationStatus,
        publicationRole: dbUser.publicationRole,
        publicationStatus: dbUser.publicationStatus,
        isPublicationRegistered: dbUser.isPublicationRegistered,
        publicationVerified: dbUser.publicationVerified,
        rejectedReason: dbUser.rejectedReason,
    });
});
exports.default = auth;
