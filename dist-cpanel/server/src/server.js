"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LOCAL DEVELOPMENT SERVER
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is ONLY used during local development via `npm run dev:api`.
 * For production (Vercel), the serverless entry point is at api/index.ts.
 *
 * It wraps the Hono app with @hono/node-server's serve() function.
 */
require("dotenv/config");
const node_server_1 = require("@hono/node-server");
const index_1 = __importDefault(require("./index"));
const PORT = Number(process.env.PORT) || 3008;
(0, node_server_1.serve)({
    fetch: index_1.default.fetch,
    port: PORT,
}, (info) => {
    console.log(`\n🚀 [DEV] Hono API Server running on http://localhost:${info.port}`);
    console.log(`   Routes: /api/auth, /api/admin, /api/core, /api/blog, ...`);
    console.log(`   Mode: LOCAL DEVELOPMENT (not for Vercel production)\n`);
});
