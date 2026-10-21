import crypto from 'node:crypto';

export function getToken(req) {
  if (!req.session._csrf) {
    req.session._csrf = crypto.randomBytes(32).toString('hex');
  }
  return req.session._csrf;
}

export function verifyToken(req, token) {
  if (!token || !req.session._csrf) return false;
  const a = Buffer.from(String(token));
  const b = Buffer.from(String(req.session._csrf));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
