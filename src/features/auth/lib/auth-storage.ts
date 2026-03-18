import type { LoginResponse, MeResponse } from '../types/auth.type';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ME_KEY = 'me';

export const authStorage = {
  setTokens: (data: Pick<LoginResponse, 'accessToken' | 'refreshToken'>) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  },
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  setMe: (me: MeResponse) => {
    localStorage.setItem(ME_KEY, JSON.stringify(me));
  },
  getMe: (): MeResponse | null => {
    const raw = localStorage.getItem(ME_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as MeResponse;
    } catch {
      localStorage.removeItem(ME_KEY);
      return null;
    }
  },
  clearMe: () => {
    localStorage.removeItem(ME_KEY);
  },
};