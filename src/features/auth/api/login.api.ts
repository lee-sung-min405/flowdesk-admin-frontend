import { axiosInstance } from '@shared/api/axios';
import type { LoginRequest, LoginResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data);
  return response.data;
}