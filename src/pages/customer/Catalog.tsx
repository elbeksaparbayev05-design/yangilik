import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalog, getUser } from '../../services/store';
import { Empty, formatSum } from '../../components/ui';

export default function Catalog() {
  const items = getCatalog();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => ['all', ...new Set(items.map((i) => i.category))], [items]);
  const filtered = items.filter(
    (i) =>
      (category === 'all' || i.category === category) &&
      i.name.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div>
      <div className="filter-bar">
        <input placeholder="Qidirish..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'Barcha toifalar' : c}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <Empty icon="🔍" text="Hech narsa topilmadi" />
      ) : (
        <div className="grid grid-3">
          {filtered.map((item) => {
            const maker = getUser(item.makerId);
            return (
              <div className="card product-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <h3 style={{ margin: '12px 0 4px' }}>{item.name}</h3>
                <div className="small muted">{item.category} · {item.material} · {item.style}</div>
                <p className="small">{item.description}</p>
                <div className="small muted">Usta: {maker?.name ?? '—'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span className="price">{formatSum(item.price)}</span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/app/orders', { state: { prefill: { title: item.name, furnitureType: item.category, makerId: item.makerId, budget: item.price } } })}
                  >
                    Buyurtma
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
