import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';

export default function Messages() {
  const { data, loading } = useData('/admin/messages');

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Xabarlar</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Bog&apos;lanish formasi orqali kelgan xabarlar</p>

      <div className="mt-8 space-y-3">
        {!loading &&
          (data || []).map((row) => (
            <Link key={row.id} to={`/admin/messages/${row.id}`} className="admin-card flex items-center justify-between gap-4 transition hover:border-brand-300">
              <div>
                <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                  {!row.is_read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                  {row.name}
                  <span className="text-xs font-normal text-slate-400">&lt;{row.email}&gt;</span>
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{row.subject || row.message}</div>
              </div>
              <span className="whitespace-nowrap text-xs text-slate-400">{row.created_at}</span>
            </Link>
          ))}
        {!loading && (!data || data.length === 0) && <p className="text-slate-400">Hozircha xabar yo&apos;q.</p>}
      </div>
    </div>
  );
}
