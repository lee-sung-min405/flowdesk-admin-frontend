import { axiosInstance } from '@shared/api/axios';
import type { UpdateAdminPermissionStatusRequest, UpdateAdminPermissionStatusResponse } from '../types/admin-permission.type';
import { ADMIN_PERMISSION_ENDPOINTS } from './admin-permission.endpoint';

export async function updateAdminPermissionStatusApi(id: number, data: UpdateAdminPermissionStatusRequest): Promise<UpdateAdminPermissionStatusResponse> {
  const response = await axiosInstance.patch<UpdateAdminPermissionStatusResponse>(ADMIN_PERMISSION_ENDPOINTS.STATUS(id), data);
  return response.data;
}
