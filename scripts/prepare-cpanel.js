import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist-cpanel');

console.log('📂 Preparing cPanel deployment bundle...');

// 1. Ensure dist-cpanel exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. Copy package.json and modify for production
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

// Remove dev dependencies and unnecessary scripts for the production bundle
delete pkg.devDependencies;
delete pkg.type; // Remove "type": "module" for CommonJS compatibility in cPanel
pkg.scripts = {
  "start": "node server/src/entry-cpanel.js"
};
// Phusion Passenger often looks for 'app.js' or 'server.js' in the root
// We will create a symlink or a wrapper server.js in a moment

fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(pkg, null, 2)
);

// 3. Create the main server.js entry point in the root of dist-cpanel
// This is what cPanel's Node.js Selector will point to.
const serverJsContent = `
/**
 * PESANTREN HUB - CPANEL ENTRY POINT
 * This file is generated automatically.
 */
require('./server/src/entry-cpanel.js');
`;
fs.writeFileSync(path.join(distDir, 'server.js'), serverJsContent);

// 4. Copy .env template or current .env
if (fs.existsSync(path.join(rootDir, '.env'))) {
  fs.copyFileSync(path.join(rootDir, '.env'), path.join(distDir, '.env'));
  console.log('✅ .env copied to dist-cpanel');
} else {
  console.log('⚠️ .env not found, skipping copy');
}

console.log('✅ dist-cpanel is ready for upload!');
console.log('ℹ️  Tip: Zip the contents of "dist-cpanel" and upload to your cPanel File Manager.');
