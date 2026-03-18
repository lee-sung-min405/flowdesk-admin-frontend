import { axiosInstance } from '@shared/api/axios';
import type { SignupRequest, SignupResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function signupApi(data: SignupRequest): Promise<SignupResponse> {
  const response = await axiosInstance.post<SignupResponse>(AUTH_ENDPOINTS.SIGNUP, data);
  return response.data;
}
