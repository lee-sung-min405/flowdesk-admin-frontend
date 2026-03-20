import { axiosInstance } from '@shared/api/axios';
import type { UpdateRolePermissionsRequest, UpdateRolePermissionsResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function updateRolePermissionsApi(id: number, data: UpdateRolePermissionsRequest): Promise<UpdateRolePermissionsResponse> {
  const response = await axiosInstance.patch<UpdateRolePermissionsResponse>(ROLE_ENDPOINTS.PERMISSIONS(id), data);
  return response.data;
}
