import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMakers, getPortfolioForMaker, getServicesForMaker } from '../../services/store';
import { Avatar, Empty, Modal, formatSum } from '../../components/ui';
import type { User } from '../../types';

export default function Makers() {
  const makers = getMakers();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<User | null>(null);

  return (
    <div>
      {makers.length === 0 ? (
        <Empty icon="👷" text="Hozircha ustalar ro'yxatga olinmagan" />
      ) : (
        <div className="grid grid-2">
          {makers.map((m) => (
            <div className="card maker-card" key={m.id}>
              <Avatar name={m.name} color={m.avatarColor} size={52} />
              <div style={{ flex: 1 }}>
                <strong>{m.name}</strong>
                <div className="small muted">{m.specialization} · {m.experienceYears} yil tajriba</div>
                <div className="small muted">📍 {m.location ?? '—'}</div>
                <p className="small">{m.bio}</p>
                <div className="order-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => setSelected(m)}>Profil va portfolio</button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/app/orders', { state: { prefill: { title: '', furnitureType: 'Shkaf', makerId: m.id } } })}
                  >
                    Buyurtma berish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <Avatar name={selected.name} color={selected.avatarColor} size={56} />
            <div>
              <div className="small muted">{selected.specialization}</div>
              <div className="small muted">{selected.experienceYears} yil tajriba · {selected.location}</div>
              <div className="small muted">📞 {selected.phone ?? '—'}</div>
            </div>
          </div>
          <h4>Xizmatlar</h4>
          {getServicesForMaker(selected.id).length === 0 ? (
            <p className="small muted">Xizmatlar kiritilmagan</p>
          ) : (
            getServicesForMaker(selected.id).map((s) => (
              <div className="card" key={s.id} style={{ padding: 12, marginBottom: 8 }}>
                <strong className="small">{s.name}</strong>
                <div className="small muted">{s.description}</div>
                <div className="price small">{formatSum(s.priceFrom)} dan</div>
              </div>
            ))
          )}
          <h4>Portfolio</h4>
          {getPortfolioForMaker(selected.id).length === 0 ? (
            <p className="small muted">Portfolio bo'sh</p>
          ) : (
            <div className="grid grid-2">
              {getPortfolioForMaker(selected.id).map((p) => (
                <div key={p.id}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, background: 'var(--green-light)' }} />
                  <div className="small"><strong>{p.title}</strong></div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
