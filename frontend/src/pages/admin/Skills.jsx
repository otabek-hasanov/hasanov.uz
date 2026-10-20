import { useState } from 'react';
import { useData } from '../../hooks/useData';
import { postJson, del, invalidate } from '../../api';
import { useToast } from './AdminToast';

const EMPTY = { name: '', icon: '', percent: 80, sort_order: 0 };

function SkillRow({ row, onSaved, onDeleted }) {
  const [form, setForm] = useState(row);
  const [busy, setBusy] = useState(false);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await postJson(`/admin/skills/${row.id}`, form);
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Bu ko'nikmani o'chirishni tasdiqlaysizmi?")) return;
    await del(`/admin/skills/${row.id}`);
    onDeleted();
  }

  return (
    <div className="admin-card flex flex-wrap items-center gap-4">
      <form onSubmit={save} className="flex flex-1 flex-wrap items-center gap-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field min-w-[140px] flex-1" />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field w-28" />
        <input type="number" value={form.percent} onChange={(e) => setForm({ ...form, percent: e.target.value })} min="0" max="100" className="input-field w-20" />
        <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-field w-20" />
        <button type="submit" disabled={busy} className="btn-outline !px-4 !py-2 text-sm">
          Yangilash
        </button>
      </form>
      <button type="button" onClick={remove} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10">
        O&apos;chirish
      </button>
    </div>
  );
}

export default function Skills() {
  const { data, loading } = useData('/admin/skills');
  const showToast = useToast();
  const [newSkill, setNewSkill] = useState(EMPTY);
  const [reloadKey, setReloadKey] = useState(0);

  function refresh() {
    invalidate('/admin/skills');
    invalidate('/skills');
    setReloadKey((k) => k + 1);
  }

  async function addSkill(e) {
    e.preventDefault();
    await postJson('/admin/skills', newSkill);
    setNewSkill(EMPTY);
    refresh();
    showToast("Ko'nikma qo'shildi.");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ko&apos;nikmalar</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Texnologiya va vositalar ro&apos;yxati</p>

      <div className="admin-card mt-8 max-w-2xl">
        <h2 className="font-semibold text-slate-700 dark:text-slate-200">Yangi ko&apos;nikma qo&apos;shish</h2>
        <form onSubmit={addSkill} className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <input placeholder="Nomi" required value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} className="input-field col-span-2 sm:col-span-1" />
          <input placeholder="Icon (masalan: php)" value={newSkill.icon} onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })} className="input-field" />
          <input type="number" placeholder="Foiz" min="0" max="100" value={newSkill.percent} onChange={(e) => setNewSkill({ ...newSkill, percent: e.target.value })} className="input-field" />
          <input type="number" placeholder="Tartib" value={newSkill.sort_order} onChange={(e) => setNewSkill({ ...newSkill, sort_order: e.target.value })} className="input-field" />
          <button type="submit" className="btn-primary col-span-2 sm:col-span-4">
            Qo&apos;shish
          </button>
        </form>
      </div>

      <div className="mt-8 space-y-3" key={reloadKey}>
        {!loading && (data || []).map((row) => <SkillRow key={row.id} row={row} onSaved={() => { refresh(); showToast("Ko'nikma yangilandi."); }} onDeleted={() => { refresh(); showToast("Ko'nikma o'chirildi."); }} />)}
      </div>
    </div>
  );
}
