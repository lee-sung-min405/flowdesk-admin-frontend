import { axiosInstance } from '@shared/api/axios';
import type { UpdateRoleRequest, UpdateRoleResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function updateRoleApi(id: number, data: UpdateRoleRequest): Promise<UpdateRoleResponse> {
  const response = await axiosInstance.patch<UpdateRoleResponse>(ROLE_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
