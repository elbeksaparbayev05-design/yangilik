import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_ACCOUNTS } from '../../services/auth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.ok || !res.user) {
      setError(res.error ?? 'Kirishda xatolik');
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
        <p className="auth-sub">Mebelingizni yasatishdan oldin ko'ring!</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Parol</label>
            <div className="pwd-wrap">
              <input id="password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd((v) => !v)}>
                {showPwd ? 'Yashirish' : "Ko'rsatish"}
              </button>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Kirish</button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">Parolni unutdingizmi?</Link>
          <div style={{ marginTop: 8 }}>
            Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
          </div>
        </div>
        <div className="demo-box">
          <strong>Demo rejim:</strong> backend ulanmagan, ma'lumotlar brauzerda saqlanadi.
          Usta sifatida kirish uchun: {DEMO_ACCOUNTS.map((a) => a.email).join(' yoki ')} (istalgan parol).
        </div>
      </div>
    </div>
  );
}
