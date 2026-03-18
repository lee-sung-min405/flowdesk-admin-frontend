import { axiosInstance } from '@shared/api/axios';
import type { UpdateUserStatusRequest, UpdateUserStatusResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function updateUserStatusApi(id: number, data: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse> {
  const response = await axiosInstance.patch<UpdateUserStatusResponse>(USER_ENDPOINTS.STATUS(id), data);
  return response.data;
}
