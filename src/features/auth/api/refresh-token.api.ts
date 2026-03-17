// src/features/auth/api/refresh-token.api.ts
import { axiosInstance } from '../../../shared/api/axios';
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/auth.type';

export async function refreshTokenApi(
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const response = await axiosInstance.post<RefreshTokenResponse>(
    '/auth/refresh-token',
    data
  );
  return response.data;
}
