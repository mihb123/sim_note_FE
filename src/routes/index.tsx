import { Route, Routes } from 'react-router-dom';
import AuthRoutes from '@auth/AuthRoutes';
import App from '@/App';


export default function RouteApp() {
  return (
    <div className="App">    
      <Routes>
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="/" element={<App />} />
      </Routes>
    </div>
  );
}