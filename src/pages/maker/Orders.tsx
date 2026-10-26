import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getOrdersForMaker, transitionOrder } from '../../services/store';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from '../../types';
import type { OrderStatus } from '../../types';
import { Empty, StatusBadge, formatDate, formatSum } from '../../components/ui';

const NEXT_LABELS: Partial<Record<OrderStatus, string>> = {
  accepted: '✅ Qabul qilish',
  in_progress: '🔨 Boshlash',
  completed: '🏁 Yakunlash',
  cancelled: '❌ Bekor qilish',
};

export default function MakerOrders() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [error, setError] = useState('');

  if (!user) return null;
  const all = getOrdersForMaker(user.id);
  const orders = filter === 'all' ? all : all.filter((o) => o.status === filter);

  const move = (id: string, next: OrderStatus) => {
    const res = transitionOrder(id, next);
    if (!res.ok) setError(res.reason ?? 'Xatolik');
    else setError('');
    setRefresh((n) => n + 1);
  };

  return (
    <div key={refresh}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}>
          <option value="all">Barcha holatlar</option>
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      {orders.length === 0 ? (
        <Empty icon="📦" text="Bu holatda buyurtmalar yo'q" />
      ) : (
        <div className="grid">
          {orders.map((o) => (
            <div className="card order-card" key={o.id}>
              <div className="order-top">
                <div>
                  <strong>{o.title}</strong>
                  <div className="small muted">Mijoz: {o.customerName} · {o.furnitureType}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
              {o.description && <p className="small" style={{ margin: 0 }}>{o.description}</p>}
              <div className="small muted">
                {o.material} · {o.color} · {o.style} · byudjet: {formatSum(o.budget)}
              </div>
              <div className="small muted">Yaratilgan: {formatDate(o.createdAt)} · Yangilangan: {formatDate(o.updatedAt)}</div>
              {ORDER_STATUS_FLOW[o.status].length > 0 && (
                <div className="order-actions">
                  {ORDER_STATUS_FLOW[o.status].map((next) => (
                    <button
                      key={next}
                      className={`btn btn-sm ${next === 'cancelled' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => move(o.id, next)}
                    >
                      {NEXT_LABELS[next] ?? ORDER_STATUS_LABELS[next]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
