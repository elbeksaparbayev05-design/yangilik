import { useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createOrder, getMakers, getOrdersForCustomer } from '../../services/store';
import { Empty, Modal, StatusBadge, formatDate, formatSum } from '../../components/ui';

interface Prefill { title: string; furnitureType: string; makerId: string; budget?: number }

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const prefill = (location.state as { prefill?: Prefill } | null)?.prefill;
  const [showForm, setShowForm] = useState(!!prefill);
  const [refresh, setRefresh] = useState(0);
  const makers = getMakers();

  const [form, setForm] = useState({
    title: prefill?.title ?? '',
    furnitureType: prefill?.furnitureType ?? 'Shkaf',
    makerId: prefill?.makerId ?? makers[0]?.id ?? '',
    description: '',
    material: 'MDF',
    color: 'Oq',
    style: 'Zamonaviy',
    budget: prefill?.budget ? String(prefill.budget) : '',
  });
  const [error, setError] = useState('');

  if (!user) return null;
  const orders = getOrdersForCustomer(user.id);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.makerId) {
      setError('Sarlavha va usta tanlanishi shart');
      return;
    }
    createOrder({
      customerId: user.id,
      customerName: user.name,
      makerId: form.makerId,
      title: form.title.trim(),
      furnitureType: form.furnitureType,
      description: form.description.trim(),
      material: form.material,
      color: form.color,
      style: form.style,
      budget: form.budget ? Number(form.budget) : undefined,
    });
    setShowForm(false);
    setError('');
    setRefresh((n) => n + 1);
  };

  return (
    <div key={refresh}>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Buyurtmalarim</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Yangi buyurtma</button>
      </div>
      {orders.length === 0 ? (
        <Empty icon="📦" text="Hali buyurtmalar yo'q" action={<button className="btn btn-primary" onClick={() => setShowForm(true)}>Buyurtma yaratish</button>} />
      ) : (
        <div className="grid">
          {orders.map((o) => {
            const maker = makers.find((m) => m.id === o.makerId);
            return (
              <div className="card order-card" key={o.id}>
                <div className="order-top">
                  <div>
                    <strong>{o.title}</strong>
                    <div className="small muted">{o.furnitureType} · usta: {maker?.name ?? '—'}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                {o.description && <p className="small" style={{ margin: 0 }}>{o.description}</p>}
                <div className="small muted">
                  {o.material} · {o.color} · {o.style} · byudjet: {formatSum(o.budget)}
                </div>
                <div className="small muted">Yaratilgan: {formatDate(o.createdAt)} · Yangilangan: {formatDate(o.updatedAt)}</div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <Modal title="Yangi buyurtma" onClose={() => setShowForm(false)}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field"><label>Sarlavha</label><input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Masalan: Oshxona shkafi" required /></div>
            <div className="field"><label>Mebel turi</label>
              <select value={form.furnitureType} onChange={(e) => set('furnitureType', e.target.value)}>
                {['Shkaf', 'Oshxona', 'Yotoqxona', 'Mehmonxona', 'Bolalar xonasi', 'Ofis'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="field"><label>Usta</label>
              <select value={form.makerId} onChange={(e) => set('makerId', e.target.value)}>
                {makers.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.specialization}</option>)}
              </select>
            </div>
            <div className="grid grid-3">
              <div className="field"><label>Material</label>
                <select value={form.material} onChange={(e) => set('material', e.target.value)}>{['MDF', "Yog'och", 'Laminat', 'Metall'].map((m) => <option key={m}>{m}</option>)}</select>
              </div>
              <div className="field"><label>Rang</label>
                <select value={form.color} onChange={(e) => set('color', e.target.value)}>{['Oq', "Yong'oq", 'Eman', 'Kulrang', 'Qora'].map((c) => <option key={c}>{c}</option>)}</select>
              </div>
              <div className="field"><label>Uslub</label>
                <select value={form.style} onChange={(e) => set('style', e.target.value)}>{['Zamonaviy', 'Minimal', 'Klassik', 'Loft'].map((s) => <option key={s}>{s}</option>)}</select>
              </div>
            </div>
            <div className="field"><label>Byudjet (so'm)</label><input type="number" min={0} value={form.budget} onChange={(e) => set('budget', e.target.value)} /></div>
            <div className="field"><label>Tavsif</label><textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Buyurtma yuborish</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
