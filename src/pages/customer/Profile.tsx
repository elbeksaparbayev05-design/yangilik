import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/ui';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', location: user?.location ?? '' });

  if (!user) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ name: form.name.trim() || user.name, phone: form.phone, location: form.location });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <Avatar name={user.name} color={user.avatarColor} size={80} />
        <h3 style={{ margin: '12px 0 4px' }}>{user.name}</h3>
        <div className="muted small">{user.email}</div>
        <div className="muted small">{user.role === 'maker' ? 'Mebel ustasi' : 'Mijoz'}</div>
      </div>
      <form className="card" onSubmit={submit}>
        <h3>Ma'lumotlarni tahrirlash</h3>
        {saved && <div className="alert alert-success">Saqlandi ✓</div>}
        <div className="field"><label>Ism</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
        <div className="field"><label>Telefon</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+998 90 000 00 00" /></div>
        <div className="field"><label>Manzil / shahar</label><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
        <div className="field"><label>Email</label><input value={user.email} disabled /><span className="hint">Email demo rejimda o'zgartirib bo'lmaydi</span></div>
        <button className="btn btn-primary" type="submit">Saqlash</button>
      </form>
    </div>
  );
}
