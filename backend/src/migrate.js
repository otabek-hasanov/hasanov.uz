import fs from 'node:fs';
import path from 'node:path';
import { pool } from './db.js';
import { config } from './config.js';

const migrationsDir = path.join(config.rootPath, 'database', 'migrations');
const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log(`Applied: ${file}`);
}

console.log('Migration complete.');
await pool.end();
