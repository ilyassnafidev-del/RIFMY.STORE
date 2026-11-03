import { access, cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const target = path.join(root, '.next', 'standalone');
await access(path.join(target, 'server.js'));
// Next's standalone server does not copy static assets automatically.
for (const [source, destination] of [['public', 'public'], ['.next/static', '.next/static'], ['drizzle', 'drizzle']]) {
  await mkdir(path.dirname(path.join(target, destination)), { recursive: true });
  await cp(path.join(root, source), path.join(target, destination), { recursive: true });
}
console.log('Verified .next/standalone/server.js; copied public, static assets and database migrations.');
