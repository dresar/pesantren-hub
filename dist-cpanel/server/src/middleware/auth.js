"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
const authMiddleware = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
        c.set('user', decoded);
        await next();
    }
    catch (err) {
        console.error('Auth Middleware Error:', err);
        return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = async (c, next) => {
    let user = c.get('user');
    if (!user) {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401);
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
            c.set('user', decoded);
            user = decoded;
        }
        catch (err) {
            console.error('Admin Middleware Auth Error:', err);
            return c.json({ error: 'Unauthorized: Invalid token' }, 401);
        }
    }
    if (user.role !== 'superadmin' && user.role !== 'petugaspendaftaran') {
        return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }
    await next();
};
exports.adminMiddleware = adminMiddleware;
