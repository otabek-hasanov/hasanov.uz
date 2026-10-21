import bcrypt from 'bcryptjs';
import { first } from '../db.js';

function regenerate(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

export async function attemptLogin(req, username, password) {
  const admin = await first('SELECT * FROM admins WHERE username = ?', [username]);
  if (!admin) return false;
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return false;
  await regenerate(req);
  req.session.adminId = admin.id;
  req.session.username = admin.username;
  return true;
}

export function isAuthenticated(req) {
  return Boolean(req.session && req.session.adminId);
}

export function logout(req) {
  return new Promise((resolve) => {
    req.session.destroy(() => resolve());
  });
}
