import type { LoginResponse, MeResponse } from '../types/auth.type';
import { authStorage } from '../lib/auth-storage';
import { useAuthStore } from './auth.store';

export const authService = {
  loginSuccess: async (data: Pick<LoginResponse, 'accessToken' | 'refreshToken' | 'expiresIn' | 'refreshExpiresAt'>) => {
    authStorage.setTokens(data);
    useAuthStore.getState().setAccessToken(data.accessToken);
    try {
      const me = await (await import('../api/me.api')).meApi();
      authStorage.setMe(me);
    } catch (e) {
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