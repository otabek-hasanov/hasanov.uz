import mysql from 'mysql2/promise';
import { config } from './config.js';

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  charset: config.db.charset.toUpperCase().replace('UTF8MB4', 'UTF8MB4_GENERAL_CI'),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function first(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

export function parseJsonField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
