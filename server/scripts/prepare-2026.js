import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');

console.log('✨ PESANTREN HUB - MODERN ARCHITECTURE 2026 ✨');

// 1. Create the ultra-simple app.js in the root
const appJsContent = `
/**
 * PESANTREN HUB - MODERN STARTUP 2026
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

process.env.NODE_ENV = 'production';

console.log('--- STARTING SERVER ---');
console.log('Node Version:', process.version);
console.log('Cwd:', process.cwd());

try {
    console.log('Loading bundle (index.js)...');
    require('./index.js');
    console.log('Bundle loaded successfully.');
} catch (error) {
    console.error('❌ CRITICAL ERROR IN APP.JS:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error('Hint: Make sure you ran "npm install" on cPanel.');
    }
    process.exit(1);
}
`;
fs.writeFileSync(path.join(serverDir, 'app.js'), appJsContent);

console.log('✅ index.js (Bundle) has been generated in the root!');
console.log('✅ app.js (Startup) is ready!');
console.log('🚀 Siap upload seluruh folder server ke cPanel.');
