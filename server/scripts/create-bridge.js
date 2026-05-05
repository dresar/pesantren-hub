import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..');

const appJsContent = `await import('./app.cjs');\n`;
fs.writeFileSync(path.join(serverDir, 'app.js'), appJsContent);

console.log('✅ app.js (Bridge) and app.cjs (Bundle) are ready!');
console.log('🚀 Silakan upload app.js, app.cjs, package.json, dan .env ke cPanel.');
