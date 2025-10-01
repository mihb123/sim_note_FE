import { Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from '@auth/pages/LoginPage';
import RegisterPage from '@auth/pages/RegisterPage';
import ThemeToggle from '@auth/components/ThemeToggle';
import VerifiedPage from '@auth/pages/VerifiedPage';
import VerificationPage from './pages/VerificationPage';

function AuthLayout() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
}

export default function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verified-success" element={<VerifiedPage />} />
        <Route path="/verification" element={<VerificationPage />} />
      </Route>
    </Routes>
  );
}
