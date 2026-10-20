import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request, postForm, invalidate } from '../../api';
import { useToast } from './AdminToast';
import { SUPPORTED_LOCALES } from '../../i18n';

const EMPTY = {
  slug: '',
  title: {},
  summary: {},
  description: {},
  tags: '',
  demo_url: '',
  repo_url: '',
  is_featured: false,
  sort_order: 0,
  cover_image: '',
  gallery_urls: [],
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [activeLocale, setActiveLocale] = useState('uz');
  const [coverPreview, setCoverPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    request(`/admin/projects/${id}`).then((res) => {
      const row = res.data;
      setForm({
        slug: row.slug,
        title: row.title || {},
        summary: row.summary || {},
        description: row.description || {},
        tags: (row.tags || []).join(', '),
        demo_url: row.demo_url || '',
        repo_url: row.repo_url || '',
        is_featured: !!row.is_featured,
        sort_order: row.sort_order || 0,
        cover_image: row.cover_image || '',
        gallery_urls: row.gallery_urls || [],
      });
    });
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    if (!isEdit) fd.append('slug', form.slug);
    SUPPORTED_LOCALES.forEach((loc) => {
      fd.append(`title_${loc}`, form.title[loc] || '');
      fd.append(`summary_${loc}`, form.summary[loc] || '');
      fd.append(`description_${loc}`, form.description[loc] || '');
    });
    fd.append('tags', form.tags);
    fd.append('demo_url', form.demo_url);
    fd.append('repo_url', form.repo_url);
    fd.append('sort_order', form.sort_order);
    if (form.is_featured) fd.append('is_featured', '1');

    const coverFile = e.target.cover_image.files[0];
    if (coverFile) fd.append('cover_image', coverFile);
    const galleryFiles = e.target.gallery.files;
    for (let i = 0; i < galleryFiles.length; i++) fd.append('gallery[]', galleryFiles[i]);

    try {
      await postForm(isEdit ? `/admin/projects/${id}` : '/admin/projects', fd);
      invalidate('/admin/projects');
      invalidate('/projects');
      showToast(isEdit ? 'Loyiha yangilandi.' : "Loyiha qo'shildi.");
      navigate('/admin/projects');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{isEdit ? 'Loyihani tahrirlash' : 'Yangi loyiha'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <div className="admin-card space-y-4">
          {!isEdit ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Slug (bo&apos;sh qoldirsa avtomatik)</label>
              <input placeholder="my-project" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" />
            </div>
          ) : (
            <p className="text-sm text-slate-400">Slug: /{form.slug}</p>
          )}

          <div>
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
                <input
                  placeholder={`Sarlavha (${loc})`}
                  required={loc === 'uz'}
                  value={form.title[loc] || ''}
                  onChange={(e) => setForm({ ...form, title: { ...form.title, [loc]: e.target.value } })}
                  className="input-field"
                />
                <input
                  placeholder={`Qisqa tavsif (${loc})`}
                  value={form.summary[loc] || ''}
                  onChange={(e) => setForm({ ...form, summary: { ...form.summary, [loc]: e.target.value } })}
                  className="input-field"
                />
                <textarea
                  rows="5"
                  placeholder={`To'liq tavsif (${loc})`}
                  value={form.description[loc] || ''}
                  onChange={(e) => setForm({ ...form, description: { ...form.description, [loc]: e.target.value } })}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            placeholder="Teglar (vergul bilan: PHP, MySQL)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="input-field sm:col-span-2"
          />
          <input placeholder="Demo URL" value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="input-field" />
          <input placeholder="Repo URL" value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} className="input-field" />
          <input type="number" placeholder="Tartib" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-field" />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
            Tanlangan (bosh sahifada ko&apos;rsatiladi)
          </label>
        </div>

        <div className="admin-card grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Muqova rasm</label>
            {form.cover_image && <img src={form.cover_image} className="mb-2 h-24 w-36 rounded-lg object-cover" alt="" />}
            <input
              type="file"
              name="cover_image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setCoverPreview(URL.createObjectURL(file));
              }}
              className="input-field"
            />
            {coverPreview && <img src={coverPreview} className="mt-2 h-24 w-36 rounded-lg object-cover" alt="" />}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Galereya rasmlari</label>
            {form.gallery_urls.length > 0 && (
              <div className="mb-2 flex gap-2">
                {form.gallery_urls.map((img) => (
                  <img key={img} src={img} className="h-16 w-16 rounded-lg object-cover" alt="" />
                ))}
              </div>
            )}
            <input type="file" name="gallery" accept="image/*" multiple className="input-field" />
            <p className="mt-1 text-xs text-slate-400">Yangi fayllar tanlansa, eski galereya almashtiriladi.</p>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? '...' : isEdit ? 'Yangilash' : "Qo'shish"}
        </button>
      </form>
    </div>
  );
}
