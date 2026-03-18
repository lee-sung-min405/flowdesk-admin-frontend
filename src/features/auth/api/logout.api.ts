import { axiosInstance } from '@shared/api/axios';
import type { LogoutRequest, LogoutResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function logoutApi(data: LogoutRequest): Promise<LogoutResponse> {
  const response = await axiosInstance.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT, data);
  return response.data;
}
