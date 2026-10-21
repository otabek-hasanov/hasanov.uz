import { query } from '../db.js';
import { increment } from '../cache.js';

export function validateContact(data) {
  const errors = {};
  const name = (data.name || '').toString().trim();
  const email = (data.email || '').toString().trim();
  const message = (data.message || '').toString().trim();
  const subject = (data.subject || '').toString().trim();

  if (!name) errors.name = ['name is required'];
  if (name.length > 160) errors.name = ['name too long'];

  if (!email) errors.email = ['email is required'];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ['email must be valid'];
  else if (email.length > 160) errors.email = ['email too long'];

  if (!message) errors.message = ['message is required'];
  else if (message.length < 5) errors.message = ['message too short'];
  else if (message.length > 5000) errors.message = ['message too long'];

  if (subject.length > 255) errors.subject = ['subject too long'];

  return { fails: Object.keys(errors).length > 0, errors };
}

export async function isRateLimited(ip) {
  const count = await increment(`contact_throttle:${ip}`, 3600);
  return count > 5;
}

export async function storeContact(data, ip) {
  const result = await query(
    'INSERT INTO messages (name, email, subject, message, ip) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.email, data.subject || '', data.message, ip]
  );
  return result.insertId;
}
