import type { ReactNode } from 'react';
import type { OrderStatus } from '../types';
import { ORDER_STATUS_LABELS } from '../types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge badge-${status}`}>{ORDER_STATUS_LABELS[status]}</span>;
}

export function Empty({ icon, text, action }: { icon: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Yopish">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Avatar({ name, color, size }: { name: string; color: string; size?: number }) {
  const style = size ? { width: size, height: size, fontSize: size * 0.42 } : undefined;
  return (
    <div className="avatar" style={{ background: color, ...style }}>
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

export function formatSum(n?: number): string {
  if (n === undefined || n === null) return '—';
  return `${n.toLocaleString('uz-UZ')} so'm`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
}
