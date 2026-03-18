import { axiosInstance } from '@shared/api/axios';
import type { UpdateUserRolesRequest, UpdateUserRolesResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function updateUserRolesApi(id: number, data: UpdateUserRolesRequest): Promise<UpdateUserRolesResponse> {
  const response = await axiosInstance.patch<UpdateUserRolesResponse>(USER_ENDPOINTS.ROLES(id), data);
  return response.data;
}
