import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/auth.type';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { refreshTokenApi } from '../api/refresh-token.api';
import { authService } from './auth.service';

export function useRefreshToken() {
  return useMutation<RefreshTokenResponse, AxiosError<ErrorResponse>, RefreshTokenRequest>({
    mutationFn: refreshTokenApi,
    onSuccess: (data) => {
      authService.loginSuccess({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        refreshExpiresAt: data.refreshExpiresAt,
      });
    },
  });
}