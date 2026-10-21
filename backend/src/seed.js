import bcrypt from 'bcryptjs';
import { query, first } from './db.js';

const [, , username, password] = process.argv;
if (!username || !password) {
  console.error('Usage: node src/seed.js <username> <password>');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const existing = await first('SELECT id FROM admins WHERE username = ?', [username]);
if (existing) {
  await query('UPDATE admins SET password = ? WHERE id = ?', [hash, existing.id]);
  console.log(`Admin password updated: ${username}`);
} else {
  await query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hash]);
  console.log(`Admin user created: ${username}`);
}

process.exit(0);
