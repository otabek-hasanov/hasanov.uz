import { verifyToken } from '../services/csrfService.js';

export function requireCsrf(req, res, next) {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.body?._token || req.headers['x-csrf-token'];
    if (!verifyToken(req, token)) {
      return res.status(419).json({ message: 'Invalid CSRF token' });
    }
  }
  next();
}
