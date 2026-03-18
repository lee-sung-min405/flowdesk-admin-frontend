import { setupAuthInterceptor } from '@shared/api/axios-interceptor';
import { authStorage } from './auth-storage';
import { refreshTokenApi } from '../api/refresh-token.api';
import { authService } from '../model/auth.service';

export function setupAuthAxiosInterceptor() {
  setupAuthInterceptor({
    getAccessToken: () => authStorage.getAccessToken(),
    getRefreshToken: () => authStorage.getRefreshToken(),
    onRefresh: async (refreshToken) => {
      const data = await refreshTokenApi({ refreshToken });
      await authService.loginSuccess(data);
      return { accessToken: data.accessToken };
    },
    onRefreshFailure: () => {
      authStorage.clearTokens();
      authStorage.clearMe();
      window.location.href = '/login';
    },
  });
}
