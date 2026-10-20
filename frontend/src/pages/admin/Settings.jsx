import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { postJson, invalidate } from '../../api';
import { useToast } from './AdminToast';
import { SUPPORTED_LOCALES } from '../../i18n';

export default function Settings() {
  const { data } = useData('/admin/settings');
  const showToast = useToast();
  const [activeLocale, setActiveLocale] = useState('uz');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        site_title: data.site_title || {},
        meta_description: data.meta_description || {},
        google_analytics_id: data.google_analytics_id || '',
        google_site_verification: data.google_site_verification || '',
      });
    }
  }, [data]);

  if (!form) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { google_analytics_id: form.google_analytics_id, google_site_verification: form.google_site_verification };
    SUPPORTED_LOCALES.forEach((loc) => {
      payload[`site_title_${loc}`] = form.site_title[loc] || '';
      payload[`meta_description_${loc}`] = form.meta_description[loc] || '';
    });
    try {
      await postJson('/admin/settings', payload);
      invalidate('/settings');
      showToast('Sozlamalar yangilandi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sozlamalar</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">SEO va sayt sozlamalari</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <div className="admin-card">
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
            {SUPPORTED_LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveLocale(loc)}
                className={`locale-tab px-3 py-2 text-sm font-medium uppercase ${activeLocale === loc ? 'is-active' : ''}`}
              >
                {loc}
              </button>
            ))}
          </div>
          {SUPPORTED_LOCALES.map((loc) => (
            <div key={loc} className={`${activeLocale === loc ? '' : 'hidden'} mt-4 space-y-3`}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Sayt sarlavhasi ({loc})</label>
                <input
                  value={form.site_title[loc] || ''}
                  onChange={(e) => setForm({ ...form, site_title: { ...form.site_title, [loc]: e.target.value } })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Meta tavsif ({loc})</label>
                <textarea
                  rows="2"
                  value={form.meta_description[loc] || ''}
                  onChange={(e) => setForm({ ...form, meta_description: { ...form.meta_description, [loc]: e.target.value } })}
                  className="input-field"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Google Analytics ID</label>
            <input
              placeholder="G-XXXXXXXXXX"
              value={form.google_analytics_id}
              onChange={(e) => setForm({ ...form, google_analytics_id: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Google Search Console tasdiqlash kodi</label>
            <input
              value={form.google_site_verification}
              onChange={(e) => setForm({ ...form, google_site_verification: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? '...' : 'Saqlash'}
        </button>
      </form>
    </div>
  );
}
