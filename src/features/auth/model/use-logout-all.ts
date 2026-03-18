import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAllApi } from '../api/logout-all.api';
import { authStorage } from '../lib/auth-storage';
import { useAuthStore } from './auth.store';

export function useLogoutAll() {
  const navigate = useNavigate();

  return useCallback(async () => {
    await logoutAllApi();

    authStorage.clearTokens();
    authStorage.clearMe();
    useAuthStore.getState().clearAuth();
    navigate('/login', { replace: true });
  }, [navigate]);
}
