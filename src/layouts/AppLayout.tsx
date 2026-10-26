import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Avatar } from '../components/ui';

const customerNav = [
  { to: '/app', label: 'Bosh sahifa', icon: '🏠', end: true },
  { to: '/app/design', label: 'AI dizayn', icon: '✨' },
  { to: '/app/catalog', label: 'Katalog', icon: '🛋️' },
  { to: '/app/orders', label: 'Buyurtmalar', icon: '📦' },
  { to: '/app/makers', label: 'Ustalar', icon: '👷' },
  { to: '/app/profile', label: 'Profil', icon: '👤' },
];

const makerNav = [
  { to: '/maker', label: 'Bosh sahifa', icon: '🏠', end: true },
  { to: '/maker/orders', label: 'Buyurtmalar', icon: '📦' },
  { to: '/maker/portfolio', label: 'Portfolio', icon: '🖼️' },
  { to: '/maker/services', label: 'Xizmatlar', icon: '💰' },
  { to: '/maker/profile', label: 'Profil', icon: '👤' },
];

const titles: Record<string, string> = {
  '/app': 'Mijoz paneli',
  '/app/design': 'AI mebel dizayni',
  '/app/catalog': 'Mebel katalogi',
  '/app/orders': 'Buyurtmalarim',
  '/app/makers': 'Mebel ustalar',
  '/app/profile': 'Profilim',
  '/maker': 'Usta paneli',
  '/maker/orders': 'Buyurtmalarni boshqarish',
  '/maker/portfolio': 'Portfoliom',
  '/maker/services': 'Xizmatlar va narxlar',
  '/maker/profile': 'Profilim',
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);

  if (!user) return null;
  const nav = user.role === 'maker' ? makerNav : customerNav;
  const title = titles[location.pathname] ?? 'Mebelchi';

  return (
    <div className="shell">
      <div className={`drawer-backdrop ${drawer ? 'show' : ''}`} onClick={() => setDrawer(false)} />
      <aside className={`sidebar ${drawer ? 'open' : ''}`}>
        <div className="brand">
          <div className="logo-mark">M</div>
          <div className="logo-name">Mebelchi</div>
        </div>
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setDrawer(false)}
          >
            <span className="nav-ico">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
        <div className="spacer" />
        <button
          className="nav-link logout"
          style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', font: 'inherit' }}
          onClick={() => { logout(); navigate('/login'); }}
        >
          <span className="nav-ico">🚪</span>
          Chiqish
        </button>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setDrawer((v) => !v)} aria-label="Menyu">☰</button>
          <div className="page-title">{title}</div>
          <div className="user-chip">
            <Avatar name={user.name} color={user.avatarColor} />
            <div>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div className="small muted">{user.role === 'maker' ? 'Usta' : 'Mijoz'}</div>
            </div>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
