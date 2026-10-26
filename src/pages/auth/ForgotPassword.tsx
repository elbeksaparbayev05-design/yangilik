import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const res = resetPassword(email);
    if (!res.ok) {
      setError(res.error ?? 'Xatolik');
      return;
    }
    setSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-mark">M</div>
          <div className="logo-name">Mebelchi</div>
        </div>
        <p className="auth-sub">Parolni tiklash</p>
        {error && <div className="alert alert-error">{error}</div>}
        {sent ? (
          <div className="alert alert-success">
            Demo rejim: haqiqiy backendda {email} manziliga tiklash havolasi yuborilardi.
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Email manzilingiz</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>Havola yuborish</button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">← Kirishga qaytish</Link>
        </div>
      </div>
    </div>
  );
}
