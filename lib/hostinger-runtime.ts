// Node-only implementation of the D1/R2 operations used by the existing API.
// The Cloudflare/Vinext build continues to use its native Worker bindings.
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDirectory = () => path.resolve(process.env.RIFMY_DATA_DIR || 'data');
let database: DatabaseSync | undefined;
function connection() {
  if (database) return database;
  mkdirSync(dataDirectory(), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path.join(dataDirectory(), 'rifmy.sqlite'));
  try {
    db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;');
    db.exec('CREATE TABLE IF NOT EXISTS _rifmy_migrations (name TEXT PRIMARY KEY)');
    const migrations = path.join(process.cwd(), 'drizzle');
    for (const name of readdirSync(migrations).filter(name => name.endsWith('.sql')).sort()) {
      if (db.prepare('SELECT name FROM _rifmy_migrations WHERE name=?').get(name)) continue;
      db.exec('BEGIN IMMEDIATE');
      try {
        db.exec(readFileSync(path.join(migrations, name), 'utf8'));
        db.prepare('INSERT INTO _rifmy_migrations(name) VALUES(?)').run(name);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    }
    database = db;
    return db;
  } catch (error) { db.close(); throw error; }
}
class Statement {
  constructor(private sql: string, private values: SQLInputValue[] = []) {}
  bind(...values: SQLInputValue[]) { return new Statement(this.sql, values); }
  async first<T>(column?: string): Promise<T | null> {
    const row = connection().prepare(this.sql).get(...this.values);
    return (row ? column ? row[column] : { ...row } : null) as T | null;
  }
  async all<T>() {
    return { success: true, results: connection().prepare(this.sql).all(...this.values).map(row => ({ ...row })) as T[], meta: {} };
  }
  execute() {
    const result = connection().prepare(this.sql).run(...this.values);
    return { success: true, results: [], meta: { changes: Number(result.changes), last_row_id: Number(result.lastInsertRowid) } };
  }
  async run() { return this.execute(); }
}
const DB = {
  prepare(sql: string) { return new Statement(sql); },
  async batch(statements: Statement[]) {
    const db = connection();
    db.exec('BEGIN IMMEDIATE');
    try { const results = statements.map(statement => statement.execute()); db.exec('COMMIT'); return results; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  },
};
function imagePath(key: string) {
  const root = path.join(dataDirectory(), 'uploads');
  const target = path.resolve(root, key);
  if (!target.startsWith(root + path.sep)) throw new Error('Invalid image path.');
  return target;
}
const BUCKET = {
  async get(key: string) {
    try {
      const file = await readFile(imagePath(key));
      const extension = path.extname(key).toLowerCase();
      const contentType = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
      return { body: new Uint8Array(file), httpMetadata: { contentType } };
    } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
  },
  async put(key: string, bytes: Uint8Array) {
    const target = imagePath(key);
    await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
    await writeFile(target, bytes, { mode: 0o600 });
  },
};
export const env = { ...process.env, RIFMY_NODE_RUNTIME: '1', DB, BUCKET };
