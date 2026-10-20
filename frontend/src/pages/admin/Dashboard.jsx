import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';

export default function Dashboard() {
  const { data } = useData('/admin/dashboard');

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Boshqaruv paneli</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sayt holati bo&apos;yicha umumiy ko&apos;rinish</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-card">
          <div className="text-3xl font-bold text-brand-500">{data?.projects_count ?? '—'}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Loyihalar</div>
        </div>
        <div className="admin-card">
          <div className="text-3xl font-bold text-brand-500">{data?.skills_count ?? '—'}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ko&apos;nikmalar</div>
        </div>
        <div className="admin-card">
          <div className="text-3xl font-bold text-brand-500">{data?.messages_count ?? '—'}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Jami xabarlar</div>
        </div>
        <div className="admin-card">
          <div className="text-3xl font-bold text-red-500">{data?.unread_count ?? '—'}</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">O&apos;qilmagan xabarlar</div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/projects" className="btn-primary">
          + Yangi loyiha
        </Link>
        <Link to="/admin/profile" className="btn-outline">
          Profilni tahrirlash
        </Link>
        <a href="/uz" target="_blank" rel="noreferrer" className="btn-outline">
          Saytni ko&apos;rish
        </a>
      </div>
    </div>
  );
}
