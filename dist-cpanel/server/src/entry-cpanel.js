"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CPANEL PRODUCTION SERVER ENTRY POINT
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is used for production deployment on cPanel.
 * It wraps the Hono app with @hono/node-server's serve() function.
 */
require("dotenv/config");
const node_server_1 = require("@hono/node-server");
const index_1 = __importDefault(require("./index"));
// Optimization for 3GB RAM:
// We suggest setting NODE_OPTIONS="--max-old-space-size=2048" in cPanel environment.
const PORT = Number(process.env.PORT) || 3008;
console.log(`\n📦 Initializing Pesantren Hub API (Production)...`);
(0, node_server_1.serve)({
    fetch: index_1.default.fetch,
    port: PORT,
}, (info) => {
    console.log(`\n🚀 [PRODUCTION] Hono API Server is live!`);
    console.log(`   Port: ${info.port}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`   RAM Limit: 2048MB (suggested)\n`);
});
