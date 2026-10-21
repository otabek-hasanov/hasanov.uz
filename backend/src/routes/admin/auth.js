import { Router } from 'express';
import { attemptLogin, isAuthenticated, logout } from '../../services/authService.js';
import { getToken } from '../../services/csrfService.js';
import { increment } from '../../cache.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/me', (req, res) => {
  if (!isAuthenticated(req)) return res.json({ authenticated: false });
  res.json({ authenticated: true, username: req.session.username, csrf_token: getToken(req) });
});

router.post('/login', async (req, res) => {
  const attempts = await increment(`login_attempts:${req.ip}`, 300);
  if (attempts > 8) {
    return res.status(429).json({ success: false, message: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring." });
  }

  const { username, password } = req.body;
  if (!username || !password || !(await attemptLogin(req, username, password))) {
    return res.status(422).json({ success: false, message: "Login yoki parol noto'g'ri." });
  }

  res.json({ success: true, csrf_token: getToken(req) });
});

router.post('/logout', requireAuth, async (req, res) => {
  await logout(req);
  res.json({ success: true });
});

export default router;
