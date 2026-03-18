import { axiosInstance } from '@shared/api/axios';
import type { LogoutAllResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function logoutAllApi(): Promise<LogoutAllResponse> {
  const response = await axiosInstance.post<LogoutAllResponse>(AUTH_ENDPOINTS.LOGOUT_ALL);
  return response.data;
}
