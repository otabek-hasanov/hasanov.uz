import { Router } from 'express';
import { query, first } from '../../db.js';
import { getSetting, flushPortfolioCache } from '../../services/portfolioService.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCsrf } from '../../middleware/csrf.js';
import { config } from '../../config.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (_req, res) => {
  res.json({
    data: {
      site_title: await getSetting('site_title', {}),
      meta_description: await getSetting('meta_description', {}),
      google_analytics_id: await getSetting('google_analytics_id', ''),
      google_site_verification: await getSetting('google_site_verification', ''),
    },
  });
});

async function save(key, value) {
  const existing = await first('SELECT `key` FROM settings WHERE `key` = ?', [key]);
  if (existing) {
    await query('UPDATE settings SET `value` = ? WHERE `key` = ?', [value, key]);
  } else {
    await query('INSERT INTO settings (`key`, `value`) VALUES (?, ?)', [key, value]);
  }
}

router.post('/', requireCsrf, async (req, res) => {
  const siteTitle = {};
  const metaDescription = {};
  config.locales.supported.forEach((loc) => {
    siteTitle[loc] = req.body[`site_title_${loc}`] || '';
    metaDescription[loc] = req.body[`meta_description_${loc}`] || '';
  });

  await save('site_title', JSON.stringify(siteTitle));
  await save('meta_description', JSON.stringify(metaDescription));
  await save('google_analytics_id', req.body.google_analytics_id || '');
  await save('google_site_verification', req.body.google_site_verification || '');

  await flushPortfolioCache();
  res.json({ success: true });
});

export default router;
