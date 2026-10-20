import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { del, invalidate } from '../../api';
import { useToast } from './AdminToast';

export default function MessageDetail() {
  const { id } = useParams();
  const { data: message } = useData(`/admin/messages/${id}`, [id]);
  const navigate = useNavigate();
  const showToast = useToast();

  if (!message) return null;

  async function remove() {
    if (!window.confirm("Xabarni o'chirishni tasdiqlaysizmi?")) return;
    await del(`/admin/messages/${id}`);
    invalidate('/admin/messages');
    showToast("Xabar o'chirildi.");
    navigate('/admin/messages');
  }

  return (
    <div>
      <Link to="/admin/messages" className="text-sm font-medium text-brand-600">
        &larr; Orqaga
      </Link>

      <div className="admin-card mt-6 max-w-2xl">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">{message.subject || 'Mavzusiz xabar'}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {message.name} &lt;{message.email}&gt; · {message.created_at} · IP: {message.ip}
        </p>
        <p className="mt-6 whitespace-pre-line text-slate-700 dark:text-slate-200">{message.message}</p>

        <div className="mt-8 flex gap-3">
          <a href={`mailto:${message.email}`} className="btn-primary">
            Javob yozish
          </a>
          <button type="button" onClick={remove} className="rounded-lg border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30">
            O&apos;chirish
          </button>
        </div>
      </div>
    </div>
  );
}
