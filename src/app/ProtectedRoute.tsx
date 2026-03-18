import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth/model/auth.store';
import { authStorage } from '@features/auth/lib/auth-storage';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const storeToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!storeToken || !!authStorage.getAccessToken();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
