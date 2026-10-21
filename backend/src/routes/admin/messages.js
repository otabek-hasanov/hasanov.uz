import { Router } from 'express';
import { query, first } from '../../db.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCsrf } from '../../middleware/csrf.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req, res) => {
  res.json({ data: await query('SELECT * FROM messages ORDER BY id DESC') });
});

router.get('/:id', async (req, res) => {
  const row = await first('SELECT * FROM messages WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ message: 'Not found' });
  await query('UPDATE messages SET is_read = 1 WHERE id = ?', [req.params.id]);
  row.is_read = 1;
  res.json({ data: row });
});

router.delete('/:id', requireCsrf, async (req, res) => {
  await query('DELETE FROM messages WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

export default router;
