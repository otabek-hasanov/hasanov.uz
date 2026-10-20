import { useState } from 'react';
import { useData } from '../../hooks/useData';
import { postJson, del, invalidate } from '../../api';
import { useToast } from './AdminToast';
import { SUPPORTED_LOCALES } from '../../i18n';

const EMPTY = {
  title: {},
  description: {},
  company: '',
  location: '',
  start_date: '',
  end_date: '',
  sort_order: 0,
};

function flatten(form) {
  const flat = { ...form };
  SUPPORTED_LOCALES.forEach((loc) => {
    flat[`title_${loc}`] = form.title[loc] || '';
    flat[`description_${loc}`] = form.description[loc] || '';
  });
  delete flat.title;
  delete flat.description;
  return flat;
}

function ExperienceForm({ initial, onSubmit, submitLabel }) {
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
      {SUPPORTED_LOCALES.map((loc) => (
        <div key={loc} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder={`Lavozim (${loc})`}
            value={form.title[loc] || ''}
            onChange={(e) => setForm({ ...form, title: { ...form.title, [loc]: e.target.value } })}
            className="input-field"
          />
          <textarea
            placeholder={`Tavsif (${loc})`}
            rows="2"
            value={form.description[loc] || ''}
            onChange={(e) => setForm({ ...form, description: { ...form.description, [loc]: e.target.value } })}
            className="input-field"
          />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <input placeholder="Kompaniya" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" />
        <input placeholder="Manzil" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
        <input placeholder="Boshlanish (2023-01)" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="input-field" />
        <input placeholder="Tugash (bo'sh=hozirgacha)" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="input-field" />
      </div>
      <input type="number" placeholder="Tartib" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-field w-28" />
      <button type="submit" disabled={busy} className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

export default function Experiences() {
  const { data, loading } = useData('/admin/experiences');
  const showToast = useToast();
  const [reloadKey, setReloadKey] = useState(0);

  function refresh() {
    invalidate('/admin/experiences');
    invalidate('/experiences');
    setReloadKey((k) => k + 1);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ish tajribasi</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Professional yo&apos;lingizni boshqaring</p>

      <details className="admin-card mt-8 max-w-3xl">
        <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">+ Yangi tajriba qo&apos;shish</summary>
        <ExperienceForm
          initial={EMPTY}
          submitLabel="Qo'shish"
          onSubmit={async (form) => {
            await postJson('/admin/experiences', flatten(form));
            refresh();
            showToast("Tajriba qo'shildi.");
          }}
        />
      </details>

      <div className="mt-8 space-y-4" key={reloadKey}>
        {!loading &&
          (data || []).map((row) => (
            <details key={row.id} className="admin-card">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                <span>
                  {row.title?.uz || Object.values(row.title || {})[0]} — {row.company}
                </span>
                <span className="text-xs font-normal text-slate-400">
                  {row.start_date} — {row.end_date || 'Hozirgacha'}
                </span>
              </summary>
              <ExperienceForm
                initial={row}
                submitLabel="Yangilash"
                onSubmit={async (form) => {
                  await postJson(`/admin/experiences/${row.id}`, flatten(form));
                  refresh();
                  showToast('Tajriba yangilandi.');
                }}
              />
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
                  await del(`/admin/experiences/${row.id}`);
                  refresh();
                  showToast("Tajriba o'chirildi.");
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
