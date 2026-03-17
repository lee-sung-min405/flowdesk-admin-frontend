import { Navigate } from 'react-router-dom';
import { authStorage } from '../features/auth/lib/auth-storage';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!authStorage.getAccessToken();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
