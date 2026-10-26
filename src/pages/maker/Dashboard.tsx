import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getOrdersForMaker, getPortfolioForMaker } from '../../services/store';
import { Empty, StatusBadge, formatDate, formatSum } from '../../components/ui';

export default function MakerDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const orders = getOrdersForMaker(user.id);
  const count = (s: string) => orders.filter((o) => o.status === s).length;

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(120deg, var(--green) 0%, #2a9d63 100%)', color: '#fff', border: 'none' }}>
        <h2 style={{ margin: '0 0 6px' }}>Salom, {user.name}! 🛠️</h2>
        <p style={{ margin: 0, opacity: 0.92 }}>{user.specialization ?? 'Mebel ustasi'} · {user.experienceYears ?? 0} yil tajriba</p>
      </div>

      <div className="grid grid-4" style={{ marginTop: 20 }}>
        <div className="card stat-card"><span className="stat-num">{count('new')}</span><span className="stat-label">Yangi buyurtmalar</span></div>
        <div className="card stat-card"><span className="stat-num">{count('accepted')}</span><span className="stat-label">Qabul qilingan</span></div>
        <div className="card stat-card"><span className="stat-num">{count('in_progress')}</span><span className="stat-label">Jarayonda</span></div>
        <div className="card stat-card"><span className="stat-num">{count('completed')}</span><span className="stat-label">Bajarilgan</span></div>
      </div>

      <div className="section-head">
        <h2>So'nggi buyurtmalar</h2>
        <Link to="/maker/orders" className="btn btn-outline btn-sm">Barchasi →</Link>
      </div>
      {orders.length === 0 ? (
        <Empty icon="📦" text="Hali buyurtmalar yo'q. Mijozlar sizga buyurtma berganda shu yerda ko'rinadi." />
      ) : (
        <div className="grid">
          {orders.slice(0, 4).map((o) => (
            <div className="card order-card" key={o.id}>
              <div className="order-top">
                <div>
                  <strong>{o.title}</strong>
                  <div className="small muted">Mijoz: {o.customerName} · byudjet: {formatSum(o.budget)}</div>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="small muted">{formatDate(o.createdAt)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="section-head"><h2>Tezkor amallar</h2></div>
      <div className="grid grid-3">
        <Link to="/maker/portfolio" className="card" style={{ color: 'inherit' }}>
          <h3>🖼️ Portfolio</h3>
          <p className="muted small">{getPortfolioForMaker(user.id).length} ta ish qo'shilgan</p>
        </Link>
        <Link to="/maker/services" className="card" style={{ color: 'inherit' }}>
          <h3>💰 Xizmatlar</h3>
          <p className="muted small">Narxlar va xizmat turlarini boshqaring</p>
        </Link>
        <Link to="/maker/profile" className="card" style={{ color: 'inherit' }}>
          <h3>👤 Profil</h3>
          <p className="muted small">Kasbiy ma'lumotlaringizni yangilang</p>
        </Link>
      </div>
    </div>
  );
}
