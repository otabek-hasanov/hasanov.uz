import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import {
  getProfile,
  getSkills,
  getExperiences,
  getEducations,
  getProjects,
  getProjectBySlug,
  getSetting,
} from '../services/portfolioService.js';
import { validateContact, isRateLimited, storeContact } from '../services/contactService.js';
import { getToken } from '../services/csrfService.js';
import { requireCsrf } from '../middleware/csrf.js';
import { config } from '../config.js';
import contactMessages from '../contactMessages.js';

const router = Router();

function assetUrl(relativePath) {
  return `${config.app.url}/${relativePath}`;
}

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.get('/csrf', (req, res) => {
  res.json({ token: getToken(req) });
});

router.get('/profile', async (_req, res) => {
  const profile = await getProfile();
  delete profile.id;
  if (profile.avatar) profile.avatar = assetUrl(profile.avatar);
  if (profile.resume_path) {
    profile.has_resume = true;
    delete profile.resume_path;
  } else {
    profile.has_resume = false;
  }
  res.json({ data: profile });
});

router.get('/skills', async (_req, res) => {
  res.json({ data: await getSkills() });
});

router.get('/experiences', async (_req, res) => {
  res.json({ data: await getExperiences() });
});

router.get('/educations', async (_req, res) => {
  const rows = await getEducations();
  rows.forEach((row) => {
    if (row.logo) row.logo = assetUrl(row.logo);
  });
  res.json({ data: rows });
});

function resolveProjectImages(project) {
  const out = { ...project };
  if (out.cover_image) out.cover_image = assetUrl(out.cover_image);
  if (out.gallery) out.gallery = out.gallery.map((img) => assetUrl(img));
  return out;
}

router.get('/projects', async (req, res) => {
  const featuredOnly = req.query.featured === '1';
  const rows = await getProjects(featuredOnly);
  res.json({ data: rows.map(resolveProjectImages) });
});

router.get('/projects/:slug', async (req, res) => {
  const project = await getProjectBySlug(req.params.slug);
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json({ data: resolveProjectImages(project) });
});

router.get('/settings', async (_req, res) => {
  const ogImage = await getSetting('og_image', '');
  res.json({
    data: {
      site_title: await getSetting('site_title', {}),
      meta_description: await getSetting('meta_description', {}),
      google_analytics_id: await getSetting('google_analytics_id', ''),
      google_site_verification: await getSetting('google_site_verification', ''),
      og_image: ogImage ? assetUrl(ogImage) : '',
    },
  });
});

router.get('/resume', async (_req, res) => {
  const profile = await getProfile();
  const relative = profile.resume_path;
  if (!relative) return res.status(404).json({ message: 'Resume not available' });
  const absolute = path.join(config.rootPath, relative);
  if (!fs.existsSync(absolute)) return res.status(404).json({ message: 'Resume not available' });
  const ext = path.extname(absolute).slice(1) || 'pdf';
  res.download(absolute, `resume-hasanov.${ext}`);
});

router.post('/contact', requireCsrf, async (req, res) => {
  const locale = config.locales.supported.includes(req.body.locale) ? req.body.locale : config.locales.default;
  const t = contactMessages[locale];

  const { fails, errors } = validateContact(req.body);
  if (fails) return res.status(422).json({ success: false, errors });

  if (await isRateLimited(req.ip)) {
    return res.status(429).json({ success: false, message: t.rateLimited });
  }

  await storeContact(req.body, req.ip);
  res.json({ success: true, message: t.success });
});

export default router;
