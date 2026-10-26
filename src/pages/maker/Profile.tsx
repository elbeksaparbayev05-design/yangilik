import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../../components/ui';

export default function MakerProfile() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    location: user?.location ?? '',
    specialization: user?.specialization ?? '',
    experienceYears: user?.experienceYears ? String(user.experienceYears) : '',
    bio: user?.bio ?? '',
  });

  if (!user) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: form.name.trim() || user.name,
      phone: form.phone,
      location: form.location,
      specialization: form.specialization,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
      bio: form.bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <Avatar name={user.name} color={user.avatarColor} size={80} />
        <h3 style={{ margin: '12px 0 4px' }}>{user.name}</h3>
        <div className="muted small">{user.specialization ?? 'Mebel ustasi'}</div>
        <div className="muted small">{user.experienceYears ?? 0} yil tajriba · {user.location ?? '—'}</div>
        <div className="muted small">{user.email}</div>
      </div>
      <form className="card" onSubmit={submit}>
        <h3>Kasbiy profil</h3>
        {saved && <div className="alert alert-success">Saqlandi ✓</div>}
        <div className="field"><label>Ism / ustaxona nomi</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
        <div className="field"><label>Mutaxassislik</label><input value={form.specialization} onChange={(e) => set('specialization', e.target.value)} placeholder="Masalan: Oshxona mebellari" /></div>
        <div className="grid grid-2">
          <div className="field"><label>Tajriba (yil)</label><input type="number" min={0} value={form.experienceYears} onChange={(e) => set('experienceYears', e.target.value)} /></div>
          <div className="field"><label>Shahar</label><input value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
        </div>
        <div className="field"><label>Telefon</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+998 90 000 00 00" /></div>
        <div className="field"><label>Haqida</label><textarea rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} /></div>
        <button className="btn btn-primary" type="submit">Saqlash</button>
      </form>
    </div>
  );
}
