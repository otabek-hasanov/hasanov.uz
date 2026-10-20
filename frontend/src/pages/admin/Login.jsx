import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export default function Login() {
  const { authenticated, loading, login } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && authenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.data?.message || "Login yoki parol noto'g'ri.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Admin panel</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Hasanov.uz boshqaruv paneliga kirish</p>

        {error && <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Login</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Parol</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? '...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
}
