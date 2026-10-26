import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { seedIfEmpty } from './services/store';
import { ProtectedRoute, RedirectHome } from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import CustomerDashboard from './pages/customer/Dashboard';
import AiDesign from './pages/customer/AiDesign';
import Catalog from './pages/customer/Catalog';
import CustomerOrders from './pages/customer/Orders';
import Makers from './pages/customer/Makers';
import CustomerProfile from './pages/customer/Profile';

import MakerDashboard from './pages/maker/Dashboard';
import MakerOrders from './pages/maker/Orders';
import Portfolio from './pages/maker/Portfolio';
import Services from './pages/maker/Services';
import MakerProfile from './pages/maker/Profile';

export default function App() {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute role="customer" />}>
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="design" element={<AiDesign />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="makers" element={<Makers />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="maker" />}>
            <Route path="/maker" element={<AppLayout />}>
              <Route index element={<MakerDashboard />} />
              <Route path="orders" element={<MakerOrders />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="services" element={<Services />} />
              <Route path="profile" element={<MakerProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
