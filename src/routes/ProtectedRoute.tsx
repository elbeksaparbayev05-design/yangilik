import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Role } from '../types';

export function ProtectedRoute({ role }: { role?: Role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (role && user.role !== role) {
    // Logged-in user of the wrong role goes to their own dashboard.
    return <Navigate to={user.role === 'maker' ? '/maker' : '/app'} replace />;
  }
  return <Outlet />;
}

export function RedirectHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'maker' ? '/maker' : '/app'} replace />;
}
