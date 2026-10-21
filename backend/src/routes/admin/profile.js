import { Router } from 'express';
import { query } from '../../db.js';
import { getProfile, flushPortfolioCache } from '../../services/portfolioService.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCsrf } from '../../middleware/csrf.js';
import { createFieldUploader, storedPath } from '../../middleware/upload.js';
import { config } from '../../config.js';

const router = Router();

const profileUpload = createFieldUploader(
  {
    avatar: { subdir: 'profile', allowedExt: ['jpg', 'jpeg', 'png', 'webp'] },
    resume: { subdir: 'resume', allowedExt: ['pdf'] },
  },
  8 * 1024 * 1024
);

router.get('/', requireAuth, async (_req, res) => {
  const profile = await getProfile();
  if (profile.avatar) profile.avatar = `${config.app.url}/${profile.avatar}`;
  if (profile.resume_path) profile.resume_path = `${config.app.url}/${profile.resume_path}`;
  res.json({ data: profile });
});

router.post('/', requireAuth, requireCsrf, profileUpload, async (req, res) => {
  const locales = config.locales.supported;
  const title = {};
  const bio = {};
  locales.forEach((loc) => {
    title[loc] = req.body[`title_${loc}`] || '';
    bio[loc] = req.body[`bio_${loc}`] || '';
  });

  const data = {
    name: req.body.name || '',
    title: JSON.stringify(title),
    bio: JSON.stringify(bio),
    email: req.body.email || '',
    phone: req.body.phone || '',
    location: req.body.location || '',
    years_experience: parseInt(req.body.years_experience || '0', 10),
    projects_done: parseInt(req.body.projects_done || '0', 10),
    happy_clients: parseInt(req.body.happy_clients || '0', 10),
    social: JSON.stringify({
      github: req.body.github || '',
      linkedin: req.body.linkedin || '',
      telegram: req.body.telegram || '',
      instagram: req.body.instagram || '',
    }),
  };

  const avatarFile = req.files?.avatar?.[0];
  if (avatarFile) data.avatar = storedPath('profile', avatarFile.filename);
  const resumeFile = req.files?.resume?.[0];
  if (resumeFile) data.resume_path = storedPath('resume', resumeFile.filename);

  const columns = Object.keys(data);
  const sql = `UPDATE profile SET ${columns.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = 1`;
  await query(sql, columns.map((c) => data[c]));
  await flushPortfolioCache();

  res.json({ success: true });
});

export default router;
