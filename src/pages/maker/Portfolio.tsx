import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deletePortfolioItem, getPortfolioForMaker, savePortfolioItem, uid } from '../../services/store';
import { Empty, Modal } from '../../components/ui';
import type { PortfolioItem } from '../../types';

const IMAGES = ['/furniture/kitchen.svg', '/furniture/wardrobe.svg', '/furniture/desk.svg', '/furniture/tv.svg', '/furniture/bed.svg', '/furniture/shelf.svg'];
const CATEGORIES = ['Oshxona', 'Yotoqxona', 'Mehmonxona', 'Bolalar xonasi', 'Ofis', 'Dahliz'];
const EMPTY_FORM = { title: '', description: '', category: CATEGORIES[0], image: IMAGES[0] };

export default function Portfolio() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  if (!user) return null;
  const items = getPortfolioForMaker(user.id);

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setFormOpen(true); };
  const openEdit = (p: PortfolioItem) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, category: p.category, image: p.image });
    setError('');
    setFormOpen(true);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Sarlavha kiritilishi shart'); return; }
    savePortfolioItem({
      id: editing?.id ?? uid('pf'),
      makerId: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      image: form.image,
    });
    setFormOpen(false);
    setEditing(null);
    setRefresh((n) => n + 1);
  };

  return (
    <div key={refresh}>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Portfoliom</h2>
        <button className="btn btn-primary" onClick={openNew}>+ Loyiha qo'shish</button>
      </div>
      {items.length === 0 ? (
        <Empty icon="🖼️" text="Portfolio bo'sh — birinchi loyihangizni qo'shing" action={<button className="btn btn-primary" onClick={openNew}>Loyiha qo'shish</button>} />
      ) : (
        <div className="grid grid-3">
          {items.map((p) => (
            <div className="card portfolio-card" key={p.id}>
              <img src={p.image} alt={p.title} />
              <h3 style={{ margin: '10px 0 4px', fontSize: 16 }}>{p.title}</h3>
              <div className="small muted">{p.category}</div>
              <p className="small">{p.description}</p>
              <div className="order-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Tahrirlash</button>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleting(p)}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? 'Loyihani tahrirlash' : 'Yangi loyiha'} onClose={() => { setFormOpen(false); setEditing(null); }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field"><label>Loyiha nomi</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="field"><label>Toifa</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field"><label>Tavsif</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="field"><label>Rasm tanlang</label>
              <div className="grid grid-3">
                {IMAGES.map((img) => (
                  <img
                    key={img} src={img} alt="variant"
                    onClick={() => setForm({ ...form, image: img })}
                    style={{ width: '100%', height: 64, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: form.image === img ? '3px solid var(--green)' : '1px solid var(--line)', background: 'var(--green-light)' }}
                  />
                ))}
              </div>
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Saqlash</button>
          </form>
        </Modal>
      )}

      {deleting && (
        <Modal title="Loyihani o'chirish" onClose={() => setDeleting(null)}>
          <p>"{deleting.title}" loyihasini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.</p>
          <div className="order-actions">
            <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Bekor qilish</button>
            <button className="btn btn-danger" onClick={() => { deletePortfolioItem(deleting.id); setDeleting(null); setRefresh((n) => n + 1); }}>O'chirish</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
