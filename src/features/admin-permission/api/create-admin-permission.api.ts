import { axiosInstance } from '@shared/api/axios';
import type { CreateAdminPermissionRequest, CreateAdminPermissionResponse } from '../types/admin-permission.type';
import { ADMIN_PERMISSION_ENDPOINTS } from './admin-permission.endpoint';

export async function createAdminPermissionApi(data: CreateAdminPermissionRequest): Promise<CreateAdminPermissionResponse> {
  const response = await axiosInstance.post<CreateAdminPermissionResponse>(ADMIN_PERMISSION_ENDPOINTS.CREATE, data);
  return response.data;
}
