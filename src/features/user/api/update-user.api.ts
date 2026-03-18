import { axiosInstance } from '@shared/api/axios';
import type { UpdateUserRequest, UpdateUserResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function updateUserApi(id: number, data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const response = await axiosInstance.patch<UpdateUserResponse>(USER_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
