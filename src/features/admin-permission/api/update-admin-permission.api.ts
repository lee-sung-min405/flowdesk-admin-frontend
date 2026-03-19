import { axiosInstance } from '@shared/api/axios';
import type { UpdateAdminPermissionRequest, UpdateAdminPermissionResponse } from '../types/admin-permission.type';
import { ADMIN_PERMISSION_ENDPOINTS } from './admin-permission.endpoint';

export async function updateAdminPermissionApi(id: number, data: UpdateAdminPermissionRequest): Promise<UpdateAdminPermissionResponse> {
  const response = await axiosInstance.patch<UpdateAdminPermissionResponse>(ADMIN_PERMISSION_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
