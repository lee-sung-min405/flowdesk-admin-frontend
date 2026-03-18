import { axiosInstance } from '@shared/api/axios';
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function refreshTokenApi(
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const response = await axiosInstance.post<RefreshTokenResponse>(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    data
  );
  return response.data;
}
