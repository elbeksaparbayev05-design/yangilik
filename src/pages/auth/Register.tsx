import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Role } from '../../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState<Role>('customer');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const res = register(name, email, password, role);
    if (!res.ok || !res.user) {
      setError(res.error ?? "Ro'yxatdan o'tishda xatolik");
      return;
    }
    navigate(res.user.role === 'maker' ? '/maker' : '/app', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark">M</div>
          <div className="logo-name">Mebelchi</div>
        </div>
        <p className="auth-sub">Yangi hisob yarating</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Kim sifatida ro'yxatdan o'tasiz?</label>
            <div className="role-picker">
              <div className={`role-option ${role === 'customer' ? 'active' : ''}`} onClick={() => setRole('customer')}>
                🛋️ Mijoz<br /><span className="small muted">Mebel buyurtma qilaman</span>
              </div>
              <div className={`role-option ${role === 'maker' ? 'active' : ''}`} onClick={() => setRole('maker')}>
                🛠️ Usta<br /><span className="small muted">Mebel yasayman</span>
              </div>
            </div>
          </div>
          <div className="field">
            <label htmlFor="name">Ismingiz</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Parol</label>
            <div className="pwd-wrap">
              <input id="password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd((v) => !v)}>
                {showPwd ? 'Yashirish' : "Ko'rsatish"}
              </button>
            </div>
            <span className="hint">Kamida 6 belgi</span>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Ro'yxatdan o'tish</button>
        </form>
        <div className="auth-links">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </div>
      </div>
    </div>
  );
}
