import { axiosInstance } from '@shared/api/axios';
import type { ChangePasswordRequest } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function changePasswordApi(data: ChangePasswordRequest): Promise<void> {
  await axiosInstance.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
}
