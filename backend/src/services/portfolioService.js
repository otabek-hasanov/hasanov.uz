import { query, first, parseJsonField } from '../db.js';
import { remember, flushPrefix } from '../cache.js';

export async function getProfile() {
  return remember('profile', 3600, async () => {
    const row = await first('SELECT * FROM profile WHERE id = 1');
    if (!row) return {};
    row.title = parseJsonField(row.title, {});
    row.bio = parseJsonField(row.bio, {});
    row.social = parseJsonField(row.social, {});
    return row;
  });
}

export async function getSkills() {
  return remember('skills', 3600, () => query('SELECT * FROM skills ORDER BY sort_order ASC'));
}

export async function getExperiences() {
  return remember('experiences', 3600, async () => {
    const rows = await query('SELECT * FROM experiences ORDER BY sort_order ASC');
    return rows.map((row) => ({
      ...row,
      title: parseJsonField(row.title, {}),
      description: parseJsonField(row.description, {}),
    }));
  });
}

export async function getEducations() {
  return remember('educations', 3600, async () => {
    const rows = await query('SELECT * FROM educations ORDER BY sort_order ASC');
    return rows.map((row) => ({ ...row, title: parseJsonField(row.title, {}) }));
  });
}

export async function getProjects(featuredOnly = false) {
  const cacheKey = featuredOnly ? 'projects_featured' : 'projects_all';
  return remember(cacheKey, 3600, async () => {
    const sql = featuredOnly
      ? 'SELECT * FROM projects WHERE is_featured = 1 ORDER BY sort_order ASC'
      : 'SELECT * FROM projects ORDER BY sort_order ASC';
    const rows = await query(sql);
    return rows.map((row) => ({
      ...row,
      title: parseJsonField(row.title, {}),
      summary: parseJsonField(row.summary, {}),
      description: parseJsonField(row.description, {}),
      tags: parseJsonField(row.tags, []),
      gallery: parseJsonField(row.gallery, []),
    }));
  });
}

export async function getProjectBySlug(slug) {
  const projects = await getProjects(false);
  return projects.find((p) => p.slug === slug) || null;
}

export async function getSetting(key, fallback = null) {
  const settings = await remember('settings', 3600, async () => {
    const rows = await query('SELECT `key`, `value` FROM settings');
    const map = {};
    rows.forEach((row) => {
      map[row.key] = row.value;
    });
    return map;
  });
  const value = settings[key];
  if (value === undefined || value === null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export async function flushPortfolioCache() {
  await flushPrefix('*');
}
