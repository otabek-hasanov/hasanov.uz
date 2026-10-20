import { useState } from 'react';
import { useData } from '../../hooks/useData';
import { postJson, del, invalidate } from '../../api';
import { useToast } from './AdminToast';
import { SUPPORTED_LOCALES } from '../../i18n';

const EMPTY = { title: {}, institution: '', logo: '', start_date: '', end_date: '', sort_order: 0 };

function flatten(form) {
  const flat = { ...form };
  SUPPORTED_LOCALES.forEach((loc) => {
    flat[`title_${loc}`] = form.title[loc] || '';
  });
  delete flat.title;
  return flat;
}

function EducationForm({ initial, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(form);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SUPPORTED_LOCALES.map((loc) => (
          <input
            key={loc}
            placeholder={`Yo'nalish (${loc})`}
            value={form.title[loc] || ''}
            onChange={(e) => setForm({ ...form, title: { ...form.title, [loc]: e.target.value } })}
            className="input-field"
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <input placeholder="Muassasa" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="input-field" />
        <input placeholder="Boshlanish" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="input-field" />
        <input placeholder="Tugash" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="input-field" />
      </div>
      <input placeholder="Muassasa logosi URL (ixtiyoriy)" value={form.logo || ''} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="input-field" />
      <input type="number" placeholder="Tartib" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-field w-28" />
      <button type="submit" disabled={busy} className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

export default function Educations() {
  const { data, loading } = useData('/admin/educations');
  const showToast = useToast();
  const [reloadKey, setReloadKey] = useState(0);

  function refresh() {
    invalidate('/admin/educations');
    invalidate('/educations');
    setReloadKey((k) => k + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ta&apos;lim</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">O&apos;qish davrlarini boshqaring</p>

      <details className="admin-card mt-8 max-w-3xl">
        <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">+ Yangi ta&apos;lim qo&apos;shish</summary>
        <EducationForm
          initial={EMPTY}
          submitLabel="Qo'shish"
          onSubmit={async (form) => {
            await postJson('/admin/educations', flatten(form));
            refresh();
            showToast("Ta'lim qo'shildi.");
          }}
        />
      </details>

      <div className="mt-8 space-y-4" key={reloadKey}>
        {!loading &&
          (data || []).map((row) => (
            <details key={row.id} className="admin-card">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                <span>
                  {row.title?.uz || Object.values(row.title || {})[0]} — {row.institution}
                </span>
                <span className="text-xs font-normal text-slate-400">
                  {row.start_date} — {row.end_date}
                </span>
              </summary>
              <EducationForm
                initial={row}
                submitLabel="Yangilash"
                onSubmit={async (form) => {
                  await postJson(`/admin/educations/${row.id}`, flatten(form));
                  refresh();
                  showToast("Ta'lim yangilandi.");
                }}
              />
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
                  await del(`/admin/educations/${row.id}`);
                  refresh();
                  showToast("Ta'lim o'chirildi.");
                }}
                className="mt-2 text-sm font-medium text-red-600"
              >
                O&apos;chirish
              </button>
            </details>
          ))}
      </div>
    </div>
  );
}
