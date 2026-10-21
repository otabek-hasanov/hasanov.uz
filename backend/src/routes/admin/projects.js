import { Router } from 'express';
import crypto from 'node:crypto';
import { query, first, parseJsonField } from '../../db.js';
import { flushPortfolioCache } from '../../services/portfolioService.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCsrf } from '../../middleware/csrf.js';
import { createUploader, storedPath } from '../../middleware/upload.js';
import { config } from '../../config.js';

const router = Router();
router.use(requireAuth);

const uploadFields = createUploader('projects', ['jpg', 'jpeg', 'png', 'webp'], 5 * 1024 * 1024).fields([
  { name: 'cover_image', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
]);

function assetUrl(relativePath) {
  return `${config.app.url}/${relativePath}`;
}

router.get('/', async (_req, res) => {
  const rows = await query('SELECT * FROM projects ORDER BY sort_order ASC');
  rows.forEach((row) => {
    row.title = parseJsonField(row.title, {});
    if (row.cover_image) row.cover_image = assetUrl(row.cover_image);
  });
  res.json({ data: rows });
});

router.get('/:id', async (req, res) => {
  const row = await first('SELECT * FROM projects WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ message: 'Not found' });
  row.title = parseJsonField(row.title, {});
  row.summary = parseJsonField(row.summary, {});
  row.description = parseJsonField(row.description, {});
  row.tags = parseJsonField(row.tags, []);
  const gallery = parseJsonField(row.gallery, []);
  row.gallery_urls = gallery.map(assetUrl);
  if (row.cover_image) row.cover_image = assetUrl(row.cover_image);
  res.json({ data: row });
});

function payload(body) {
  const title = {};
  const summary = {};
  const description = {};
  config.locales.supported.forEach((loc) => {
    title[loc] = body[`title_${loc}`] || '';
    summary[loc] = body[`summary_${loc}`] || '';
    description[loc] = body[`description_${loc}`] || '';
  });
  const tags = (body.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    title: JSON.stringify(title),
    summary: JSON.stringify(summary),
    description: JSON.stringify(description),
    tags: JSON.stringify(tags),
    demo_url: body.demo_url || '',
    repo_url: body.repo_url || '',
    is_featured: body.is_featured ? 1 : 0,
    sort_order: parseInt(body.sort_order || '0', 10),
  };
}

function slugify(text) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || crypto.randomBytes(4).toString('hex');
}

router.post('/', requireCsrf, uploadFields, async (req, res) => {
  const data = payload(req.body);

  const slugInput = req.body.slug || req.body.title_uz || '';
  let slug = slugify(slugInput);
  if (await first('SELECT id FROM projects WHERE slug = ?', [slug])) {
    slug += `-${crypto.randomBytes(3).toString('hex')}`;
  }
  data.slug = slug;

  const coverFile = req.files?.cover_image?.[0];
  if (coverFile) data.cover_image = storedPath('projects', coverFile.filename);

  const galleryFiles = req.files?.gallery || [];
  data.gallery = JSON.stringify(galleryFiles.map((f) => storedPath('projects', f.filename)));

  const columns = Object.keys(data);
  const result = await query(
    `INSERT INTO projects (${columns.map((c) => `\`${c}\``).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
    columns.map((c) => data[c])
  );
  await flushPortfolioCache();
  res.json({ success: true, id: result.insertId, slug });
});

router.post('/:id', requireCsrf, uploadFields, async (req, res) => {
  const data = payload(req.body);

  const coverFile = req.files?.cover_image?.[0];
  if (coverFile) data.cover_image = storedPath('projects', coverFile.filename);

  const galleryFiles = req.files?.gallery || [];
  if (galleryFiles.length) {
    data.gallery = JSON.stringify(galleryFiles.map((f) => storedPath('projects', f.filename)));
  }

  const columns = Object.keys(data);
  await query(
    `UPDATE projects SET ${columns.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`,
    [...columns.map((c) => data[c]), req.params.id]
  );
  await flushPortfolioCache();
  res.json({ success: true });
});

router.delete('/:id', requireCsrf, async (req, res) => {
  await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
  await flushPortfolioCache();
  res.json({ success: true });
});

export default router;
