import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deleteService, getServicesForMaker, saveService, uid } from '../../services/store';
import { Empty, Modal, formatSum } from '../../components/ui';
import type { MakerService } from '../../types';

const CATEGORIES = ['Oshxona', 'Yotoqxona', 'Mehmonxona', 'Bolalar xonasi', 'Ofis', 'Dahliz'];
const EMPTY_FORM = { name: '', description: '', priceFrom: '', categories: [] as string[] };

export default function Services() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MakerService | null>(null);
  const [deleting, setDeleting] = useState<MakerService | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  if (!user) return null;
  const items = getServicesForMaker(user.id);

  const toggleCategory = (c: string) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c],
    }));

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setFormOpen(true); };
  const openEdit = (s: MakerService) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description, priceFrom: String(s.priceFrom), categories: s.categories });
    setError('');
    setFormOpen(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Xizmat nomi kiritilishi shart'); return; }
    if (!form.priceFrom || Number(form.priceFrom) <= 0) { setError("Narx 0 dan katta bo'lsin"); return; }
    saveService({
      id: editing?.id ?? uid('svc'),
      makerId: user.id,
      name: form.name.trim(),
      description: form.description.trim(),
      priceFrom: Number(form.priceFrom),
      categories: form.categories,
    });
    setFormOpen(false);
    setEditing(null);
    setRefresh((n) => n + 1);
  };

  return (
    <div key={refresh}>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Xizmatlar va narxlar</h2>
        <button className="btn btn-primary" onClick={openNew}>+ Xizmat qo'shish</button>
      </div>
      {items.length === 0 ? (
        <Empty icon="💰" text="Hali xizmatlar qo'shilmagan" action={<button className="btn btn-primary" onClick={openNew}>Xizmat qo'shish</button>} />
      ) : (
        <div className="grid grid-2">
          {items.map((s) => (
            <div className="card" key={s.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                <strong>{s.name}</strong>
                <span className="price">{formatSum(s.priceFrom)} dan</span>
              </div>
              <p className="small">{s.description}</p>
              <div className="small muted">{s.categories.join(' · ')}</div>
              <div className="order-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Tahrirlash</button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleting(s)}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? 'Xizmatni tahrirlash' : "Yangi xizmat"} onClose={() => { setFormOpen(false); setEditing(null); }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field"><label>Xizmat nomi</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="field"><label>Tavsif</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="field"><label>Boshlang'ich narx (so'm)</label><input type="number" min={0} value={form.priceFrom} onChange={(e) => setForm({ ...form, priceFrom: e.target.value })} required /></div>
            <div className="field"><label>Mebel toifalari</label>
              <div className="grid grid-3">
                {CATEGORIES.map((c) => (
                  <label key={c} className="small" style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.categories.includes(c)} onChange={() => toggleCategory(c)} /> {c}
                  </label>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Saqlash</button>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Xizmatni o'chirish" onClose={() => setDeleting(null)}>
          <p>"{deleting.name}" xizmatini o'chirmoqchimisiz?</p>
          <div className="order-actions">
            <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Bekor qilish</button>
            <button className="btn btn-danger" onClick={() => { deleteService(deleting.id); setDeleting(null); setRefresh((n) => n + 1); }}>O'chirish</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
