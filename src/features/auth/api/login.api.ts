import { axiosInstance } from '../../../shared/api/axios';
import type { LoginRequest, LoginResponse } from '../types/auth.type';

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', data);
  return response.data;
}