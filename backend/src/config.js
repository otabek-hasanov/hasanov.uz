import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

function bool(value, fallback) {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === 'true';
}

export const config = {
  rootPath: path.join(__dirname, '../..'),
  app: {
    name: process.env.APP_NAME || 'Hasanov.uz',
    env: process.env.APP_ENV || 'production',
    debug: bool(process.env.APP_DEBUG, false),
    url: (process.env.APP_URL || 'https://hasanov.uz').replace(/\/+$/, ''),
    key: process.env.APP_KEY || '',
    timezone: process.env.APP_TIMEZONE || 'Asia/Tashkent',
    port: parseInt(process.env.PORT || process.env.APP_PORT || '3000', 10),
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_DATABASE || 'hasanov_uz',
    user: process.env.DB_USERNAME || 'hasanov_uz',
    password: process.env.DB_PASSWORD || '',
    charset: process.env.DB_CHARSET || 'utf8mb4',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD === 'null' ? undefined : process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  session: {
    prefix: process.env.SESSION_PREFIX || 'hasanov_session',
    lifetimeMinutes: parseInt(process.env.SESSION_LIFETIME || '120', 10),
  },
  cache: {
    prefix: process.env.CACHE_PREFIX || 'hasanov_cache',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
  locales: {
    default: 'uz',
    supported: ['uz', 'ru', 'en'],
  },
};
