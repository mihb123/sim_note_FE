import { Route, Routes } from 'react-router-dom';
import AuthRoutes from '@features/auth/AuthRoutes';

export default function App() {
  return (
    <div className="App">    
      <Routes>
        <Route path="auth/*" element={<AuthRoutes />} />
      </Routes>
    </div>
  );
}