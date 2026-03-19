import { axiosInstance } from '@shared/api/axios';
import type { AdminPermissionResponse } from '../types/admin-permission.type';
import { ADMIN_PERMISSION_ENDPOINTS } from './admin-permission.endpoint';

export async function getAdminPermissionApi(id: number): Promise<AdminPermissionResponse> {
  const response = await axiosInstance.get<AdminPermissionResponse>(ADMIN_PERMISSION_ENDPOINTS.DETAIL(id));
  return response.data;
}
