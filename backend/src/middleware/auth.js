import { isAuthenticated } from '../services/authService.js';

export function requireAuth(req, res, next) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  next();
}
