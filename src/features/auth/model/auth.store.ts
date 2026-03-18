import { create } from 'zustand';
import type { MeResponse } from '../types/auth.type';
import { authStorage } from '../lib/auth-storage';

type AuthState = {
  accessToken: string | null;
  me: MeResponse | null;
  setAccessToken: (accessToken: string) => void;
  setMe: (me: MeResponse) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: authStorage.getAccessToken(),
  me: authStorage.getMe(),
  setAccessToken: (accessToken) => set({ accessToken }),
  setMe: (me) => set({ me }),
  clearAuth: () => set({ accessToken: null, me: null }),
}));