"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const hono_1 = require("hono");
const logger_1 = require("hono/logger");
const cors_1 = require("hono/cors");
const pretty_json_1 = require("hono/pretty-json");
const auth_1 = __importDefault(require("./modules/auth"));
const admin_1 = __importDefault(require("./modules/admin"));
const users_1 = __importDefault(require("./modules/users"));
const payments_1 = __importDefault(require("./modules/payments"));
const admissions_1 = __importDefault(require("./modules/admissions"));
const blog_1 = __importDefault(require("./modules/blog"));
const core_1 = __importDefault(require("./modules/core"));
const upload_1 = __importDefault(require("./modules/upload"));
const notifications_1 = __importDefault(require("./modules/notifications"));
const santri_1 = __importDefault(require("./modules/santri"));
const media_1 = __importDefault(require("./modules/media"));
const publication_1 = require("./modules/publication");
const app = new hono_1.Hono();
// ── Middlewares ───────────────────────────────────────────────────────────────
app.use('*', (0, logger_1.logger)());
app.use('*', (0, cors_1.cors)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use('*', (0, pretty_json_1.prettyJSON)());
// ── Global Error Handler ──────────────────────────────────────────────────────
app.onError((err, c) => {
    console.error('[API ERROR]:', err);
    // Check for common DB errors
    const isDbError = err?.name === 'NeonDbError' || err?.message?.toLowerCase().includes('database') || err?.code?.startsWith('57');
    if (isDbError) {
        console.error('CRITICAL: Database connection issue detected.');
    }
    return c.json({
        error: err?.message || 'Internal Server Error',
        message: err?.code ? `Code: ${err.code}` : undefined,
        name: err?.name,
        stack: process.env.NODE_ENV !== 'production' ? err?.stack : undefined,
        path: c.req.path,
        timestamp: new Date().toISOString(),
    }, 500);
});
// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (c) => {
    return c.json({
        message: 'Pesantren Hub API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
app.get('/health', (c) => {
    return c.json({ status: 'ok', uptime: process.uptime() });
});
// ── API Routes ────────────────────────────────────────────────────────────────
const apiRoutes = {
    auth: auth_1.default, admin: admin_1.default, users: users_1.default, payments: payments_1.default, psb: admissions_1.default,
    blog: blog_1.default, core: core_1.default, upload: upload_1.default, media: media_1.default, notifications: notifications_1.default, santri: santri_1.default, publication: publication_1.publication
};
Object.entries(apiRoutes).forEach(([path, module]) => {
    app.route(`/api/${path}`, module);
    app.route(`/${path}`, module);
});
// Export for serverless handle
exports.default = app;
