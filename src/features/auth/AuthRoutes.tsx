import { Outlet, Route, Routes } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import { ModeToggle } from "@/components/Toggle_theme/toggle-mode";
import VerifiedPage from '@/features/auth/pages/VerifiedPage';
import VerificationPage from './pages/VerificationPage';
import { ThemeProvider } from "@/components/Toggle_theme/theme-provider";

function AuthLayout() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <Outlet />
      </div>
    </ThemeProvider>
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
