import { redis } from './redis.js';
import { config } from './config.js';

function key(name) {
  return `${config.cache.prefix}:${name}`;
}

export async function remember(name, ttl, fetcher) {
  try {
    const cached = await redis.get(key(name));
    if (cached !== null) return JSON.parse(cached);
  } catch {}
  const value = await fetcher();
  try {
    await redis.setex(key(name), ttl, JSON.stringify(value));
  } catch {}
  return value;
}

export async function forget(name) {
  try {
    await redis.del(key(name));
  } catch {}
}

export async function flushPrefix(pattern) {
  try {
    const keys = await redis.keys(key(pattern));
    if (keys.length) await redis.del(keys);
  } catch {}
}

export async function increment(name, ttl) {
  try {
    const value = await redis.incr(key(name));
    if (value === 1) await redis.expire(key(name), ttl);
    return value;
  } catch {
    return 0;
  }
}
