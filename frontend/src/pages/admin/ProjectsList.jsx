import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { del, invalidate } from '../../api';
import { useToast } from './AdminToast';
import { useState } from 'react';

export default function ProjectsList() {
  const { data, loading } = useData('/admin/projects');
  const showToast = useToast();
  const [reloadKey, setReloadKey] = useState(0);

  async function remove(id) {
    if (!window.confirm("Loyihani o'chirishni tasdiqlaysizmi?")) return;
    await del(`/admin/projects/${id}`);
    invalidate('/admin/projects');
    invalidate('/projects');
    setReloadKey((k) => k + 1);
    showToast("Loyiha o'chirildi.");
  }

  return (
    <div key={reloadKey}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Loyihalar</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Portfolio loyihalarini boshqaring</p>
        </div>
        <Link to="/admin/projects/create" className="btn-primary">
          + Yangi loyiha
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {!loading &&
          (data || []).map((row) => (
            <div key={row.id} className="admin-card flex flex-wrap items-center gap-4">
              {row.cover_image ? (
                <img src={row.cover_image} className="h-14 w-20 rounded-lg object-cover" alt="" />
              ) : (
                <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-800">No image</div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-slate-700 dark:text-slate-200">{row.title?.uz || Object.values(row.title || {})[0]}</div>
                <div className="text-xs text-slate-400">
                  /{row.slug}
                  {row.is_featured ? ' · Tanlangan' : ''}
                </div>
              </div>
              <Link to={`/admin/projects/${row.id}/edit`} className="btn-outline !px-4 !py-2 text-sm">
                Tahrirlash
              </Link>
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
              >
                O&apos;chirish
              </button>
            </div>
          ))}
        {!loading && (!data || data.length === 0) && <p className="text-slate-400">Hozircha loyiha qo&apos;shilmagan.</p>}
      </div>
    </div>
  );
}
