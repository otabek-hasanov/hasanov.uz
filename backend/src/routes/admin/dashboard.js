import { Router } from 'express';
import { query } from '../../db.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
  const [[projects], [skills], [messages], [unread]] = await Promise.all([
    query('SELECT COUNT(*) AS c FROM projects'),
    query('SELECT COUNT(*) AS c FROM skills'),
    query('SELECT COUNT(*) AS c FROM messages'),
    query('SELECT COUNT(*) AS c FROM messages WHERE is_read = 0'),
  ]);

  res.json({
    data: {
      projects_count: projects.c,
      skills_count: skills.c,
      messages_count: messages.c,
      unread_count: unread.c,
    },
  });
});

export default router;
