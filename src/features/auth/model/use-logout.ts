import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@shared/api/query-client';
import { logoutApi } from '../api/logout.api';
import { authStorage } from '../lib/auth-storage';
import { useAuthStore } from './auth.store';

export function useLogout() {
  const navigate = useNavigate();

  return useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();

    if (refreshToken) {
      try {
        await logoutApi({ refreshToken });
      } catch {
        // 토큰 폐기 실패해도 로컬 로그아웃은 진행
      }
    }

    authStorage.clearTokens();
    authStorage.clearMe();
    useAuthStore.getState().clearAuth();
    queryClient.clear();
    navigate('/login', { replace: true });
  }, [navigate]);
}
