import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import { useData } from '../../hooks/useData';
import { AdminToastProvider } from './AdminToast';

const NAV_ITEMS = [
  { to: '/admin', label: 'Boshqaruv', end: true },
  { to: '/admin/profile', label: 'Profil' },
  { to: '/admin/skills', label: "Ko'nikmalar" },
  { to: '/admin/experiences', label: 'Tajriba' },
  { to: '/admin/educations', label: "Ta'lim" },
  { to: '/admin/projects', label: 'Loyihalar' },
  { to: '/admin/messages', label: 'Xabarlar' },
  { to: '/admin/settings', label: 'Sozlamalar' },
];

export default function AdminLayout() {
  const { loading, authenticated, logout } = useAdminAuth();
  const { data: dashboard } = useData('/admin/dashboard');

  if (loading) return null;
  if (!authenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <div className="flex min-h-screen">
        <aside className="glass hidden w-64 flex-col p-6 lg:flex">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Hasanov<span className="text-brand-500">.</span> Admin
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.to === '/admin/messages' && dashboard?.unread_count > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">{dashboard.unread_count}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-auto w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Chiqish
          </button>
        </aside>

        <div className="flex-1">
          <header className="glass flex items-center justify-between px-6 py-4 lg:hidden">
            <div className="text-lg font-bold text-slate-800 dark:text-white">Hasanov Admin</div>
            <button type="button" onClick={logout} className="text-sm font-medium text-slate-500">
              Chiqish
            </button>
          </header>

          <nav className="glass flex gap-2 overflow-x-auto px-4 py-2 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                    isActive ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <main className="p-6">
            <AdminToastProvider>
              <Outlet />
            </AdminToastProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
