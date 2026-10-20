import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { postForm, invalidate } from '../../api';
import { useToast } from './AdminToast';
import { SUPPORTED_LOCALES } from '../../i18n';

export default function Profile() {
  const { data } = useData('/admin/profile');
  const showToast = useToast();
  const [activeLocale, setActiveLocale] = useState('uz');
  const [form, setForm] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        title: data.title || {},
        bio: data.bio || {},
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        years_experience: data.years_experience || 0,
        projects_done: data.projects_done || 0,
        happy_clients: data.happy_clients || 0,
        social: data.social || {},
        avatar: data.avatar || '',
        resume_path: data.resume_path || '',
      });
    }
  }, [data]);

  if (!form) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function setLocalized(field, locale, value) {
    setForm((f) => ({ ...f, [field]: { ...f[field], [locale]: value } }));
  }
  function setSocial(key, value) {
    setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('phone', form.phone);
    fd.append('location', form.location);
    fd.append('years_experience', form.years_experience);
    fd.append('projects_done', form.projects_done);
    fd.append('happy_clients', form.happy_clients);
    SUPPORTED_LOCALES.forEach((loc) => {
      fd.append(`title_${loc}`, form.title[loc] || '');
      fd.append(`bio_${loc}`, form.bio[loc] || '');
    });
    ['github', 'linkedin', 'telegram', 'instagram'].forEach((key) => fd.append(key, form.social[key] || ''));
    const avatarFile = e.target.avatar.files[0];
    if (avatarFile) fd.append('avatar', avatarFile);
    const resumeFile = e.target.resume.files[0];
    if (resumeFile) fd.append('resume', resumeFile);

    try {
      await postForm('/admin/profile', fd);
      invalidate('/profile');
      invalidate('/admin/profile');
      showToast('Profil yangilandi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Profil</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Shaxsiy ma&apos;lumotlarni tahrirlang</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <div className="admin-card space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Ism</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required className="input-field" />
          </div>

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
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Lavozim ({loc})</label>
                  <input type="text" value={form.title[loc] || ''} onChange={(e) => setLocalized('title', loc, e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Bio ({loc})</label>
                  <textarea rows="4" value={form.bio[loc] || ''} onChange={(e) => setLocalized('bio', loc, e.target.value)} className="input-field" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Telefon</label>
            <input type="text" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Manzil</label>
            <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Tajriba (yil)</label>
            <input type="number" value={form.years_experience} onChange={(e) => set('years_experience', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Bajarilgan loyihalar</label>
            <input type="number" value={form.projects_done} onChange={(e) => set('projects_done', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Mamnun mijozlar</label>
            <input type="number" value={form.happy_clients} onChange={(e) => set('happy_clients', e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="admin-card grid grid-cols-1 gap-4 sm:grid-cols-2">
          {['github', 'linkedin', 'telegram', 'instagram'].map((key) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium capitalize text-slate-600 dark:text-slate-300">{key}</label>
              <input type="url" value={form.social[key] || ''} onChange={(e) => setSocial(key, e.target.value)} className="input-field" />
            </div>
          ))}
        </div>

        <div className="admin-card grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Profil rasmi</label>
            {form.avatar && <img src={form.avatar} alt="" className="mb-2 h-20 w-20 rounded-full object-cover" />}
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setAvatarPreview(URL.createObjectURL(file));
              }}
              className="input-field"
            />
            {avatarPreview && <img src={avatarPreview} alt="" className="mt-2 h-20 w-20 rounded-full object-cover" />}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">Rezume (PDF)</label>
            {form.resume_path && (
              <a href={form.resume_path} target="_blank" rel="noreferrer" className="mb-2 block text-sm text-brand-600">
                Joriy faylni ko&apos;rish
              </a>
            )}
            <input type="file" name="resume" accept="application/pdf" className="input-field" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? '...' : 'Saqlash'}
        </button>
      </form>
    </div>
  );
}
