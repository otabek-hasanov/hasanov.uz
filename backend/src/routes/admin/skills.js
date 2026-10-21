import { Router } from 'express';
import { query } from '../../db.js';
import { flushPortfolioCache } from '../../services/portfolioService.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCsrf } from '../../middleware/csrf.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req, res) => {
  res.json({ data: await query('SELECT * FROM skills ORDER BY sort_order ASC') });
});

function payload(body) {
  return [
    body.name || '',
    body.icon || '',
    Math.max(0, Math.min(100, parseInt(body.percent || '80', 10))),
    parseInt(body.sort_order || '0', 10),
  ];
}

router.post('/', requireCsrf, async (req, res) => {
  const result = await query(
    'INSERT INTO skills (name, icon, percent, sort_order) VALUES (?, ?, ?, ?)',
    payload(req.body)
  );
  await flushPortfolioCache();
  res.json({ success: true, id: result.insertId });
});

router.post('/:id', requireCsrf, async (req, res) => {
  await query('UPDATE skills SET name = ?, icon = ?, percent = ?, sort_order = ? WHERE id = ?', [
    ...payload(req.body),
    req.params.id,
  ]);
  await flushPortfolioCache();
  res.json({ success: true });
});

router.delete('/:id', requireCsrf, async (req, res) => {
  await query('DELETE FROM skills WHERE id = ?', [req.params.id]);
  await flushPortfolioCache();
  res.json({ success: true });
});

export default router;
