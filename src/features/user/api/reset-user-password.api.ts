import { axiosInstance } from '@shared/api/axios';
import type { ResetUserPasswordRequest } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function resetUserPasswordApi(id: number, data: ResetUserPasswordRequest): Promise<void> {
  await axiosInstance.patch(USER_ENDPOINTS.PASSWORD(id), data);
}
