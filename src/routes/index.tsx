import { Route, Routes } from 'react-router-dom';
import AuthRoutes from '@/features/auth/AuthRoutes';
import App from '@/App';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RouteApp() {
  return (
    <div className="App">    
      <Routes>
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="/" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}