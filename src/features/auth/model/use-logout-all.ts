import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@shared/api/query-client';
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
    queryClient.clear();
    navigate('/login', { replace: true });
  }, [navigate]);
}
