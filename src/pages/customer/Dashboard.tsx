import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getDesignsForCustomer, getOrdersForCustomer } from '../../services/store';
import { Empty, StatusBadge, formatDate } from '../../components/ui';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const orders = getOrdersForCustomer(user.id);
  const designs = getDesignsForCustomer(user.id);
  const active = orders.filter((o) => o.status === 'new' || o.status === 'accepted' || o.status === 'in_progress');

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(120deg, var(--green) 0%, #2a9d63 100%)', color: '#fff', border: 'none' }}>
        <h2 style={{ margin: '0 0 6px' }}>Xush kelibsiz, {user.name}! 👋</h2>
        <p style={{ margin: '0 0 16px', opacity: 0.92 }}>Xonangizga mos mebel dizaynini AI bilan yarating va ustaga buyurtma bering.</p>
        <Link to="/app/design" className="btn" style={{ background: '#fff', color: 'var(--green-dark)' }}>✨ Dizayn boshlash</Link>
      </div>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        <div className="card stat-card"><span className="stat-num">{orders.length}</span><span className="stat-label">Jami buyurtmalar</span></div>
        <div className="card stat-card"><span className="stat-num">{active.length}</span><span className="stat-label">Faol buyurtmalar</span></div>
        <div className="card stat-card"><span className="stat-num">{designs.length}</span><span className="stat-label">Saqlangan dizaynlar</span></div>
      </div>

      <div className="section-head">
        <h2>So'nggi buyurtmalar</h2>
        <Link to="/app/orders" className="btn btn-outline btn-sm">Barchasi →</Link>
      </div>
      {orders.length === 0 ? (
        <Empty icon="📦" text="Hali buyurtmalar yo'q. Katalogdan mebel tanlang yoki AI dizayn yarating." />
      ) : (
        <div className="grid">
          {orders.slice(0, 3).map((o) => (
            <div className="card order-card" key={o.id}>
              <div className="order-top">
                <strong>{o.title}</strong>
                <StatusBadge status={o.status} />
              </div>
              <div className="small muted">{o.furnitureType} · {formatDate(o.createdAt)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="section-head"><h2>Tezkor amallar</h2></div>
      <div className="grid grid-3">
        <Link to="/app/design" className="card" style={{ color: 'inherit' }}><h3>✨ AI dizayn</h3><p className="muted small">Mebel turini, material va uslubni tanlab dizayn konsepsiyasini yarating.</p></Link>
        <Link to="/app/catalog" className="card" style={{ color: 'inherit' }}><h3>🛋️ Katalog</h3><p className="muted small">Ustalarning tayyor mebellarini ko'ring va buyurtma bering.</p></Link>
        <Link to="/app/makers" className="card" style={{ color: 'inherit' }}><h3>👷 Ustalar</h3><p className="muted small">Tajribali mebel ustalarini va portfoliolarini ko'ring.</p></Link>
      </div>
    </div>
  );
}
