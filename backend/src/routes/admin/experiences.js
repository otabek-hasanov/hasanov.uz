import { Router } from 'express';
import { query, parseJsonField } from '../../db.js';
import { flushPortfolioCache } from '../../services/portfolioService.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCsrf } from '../../middleware/csrf.js';
import { config } from '../../config.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req, res) => {
  const rows = await query('SELECT * FROM experiences ORDER BY sort_order ASC');
  rows.forEach((row) => {
    row.title = parseJsonField(row.title, {});
    row.description = parseJsonField(row.description, {});
  });
  res.json({ data: rows });
});

function payload(body) {
  const title = {};
  const description = {};
  config.locales.supported.forEach((loc) => {
    title[loc] = body[`title_${loc}`] || '';
    description[loc] = body[`description_${loc}`] || '';
  });
  return [
    JSON.stringify(title),
    body.company || '',
    body.location || '',
    body.start_date || '',
    body.end_date || '',
    JSON.stringify(description),
    parseInt(body.sort_order || '0', 10),
  ];
}

router.post('/', requireCsrf, async (req, res) => {
  const result = await query(
    'INSERT INTO experiences (title, company, location, start_date, end_date, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
    payload(req.body)
  );
  await flushPortfolioCache();
  res.json({ success: true, id: result.insertId });
});

router.post('/:id', requireCsrf, async (req, res) => {
  await query(
    'UPDATE experiences SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?, sort_order = ? WHERE id = ?',
    [...payload(req.body), req.params.id]
  );
  await flushPortfolioCache();
  res.json({ success: true });
});

router.delete('/:id', requireCsrf, async (req, res) => {
  await query('DELETE FROM experiences WHERE id = ?', [req.params.id]);
  await flushPortfolioCache();
  res.json({ success: true });
});

export default router;
