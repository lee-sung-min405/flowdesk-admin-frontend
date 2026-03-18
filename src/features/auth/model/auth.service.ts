import type { LoginResponse, MeResponse } from '../types/auth.type';
import { authStorage } from '../lib/auth-storage';
import { useAuthStore } from './auth.store';
import { meApi } from '../api/me.api';

export const authService = {
  loginSuccess: async (data: Pick<LoginResponse, 'accessToken' | 'refreshToken' | 'expiresIn' | 'refreshExpiresAt'>) => {
    authStorage.setTokens(data);
    useAuthStore.getState().setAccessToken(data.accessToken);
    try {
      const me = await meApi();
      authStorage.setMe(me);
      useAuthStore.getState().setMe(me);
    } catch (e) {
      console.error('[auth] 사용자 정보 조회 실패:', e);
      authStorage.clearMe();
    }
  },
  setMe: (me: MeResponse) => {
    authStorage.setMe(me);
  },
  getMe: (): MeResponse | null => {
    return authStorage.getMe();
  },
  clearMe: () => {
    authStorage.clearMe();
  },
};