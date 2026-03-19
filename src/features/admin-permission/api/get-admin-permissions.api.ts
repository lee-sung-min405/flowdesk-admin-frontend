import { axiosInstance } from '@shared/api/axios';
import type { GetAdminPermissionsRequest, GetAdminPermissionsResponse } from '../types/admin-permission.type';
import { ADMIN_PERMISSION_ENDPOINTS } from './admin-permission.endpoint';

export async function getAdminPermissionsApi(params: GetAdminPermissionsRequest): Promise<GetAdminPermissionsResponse> {
  const response = await axiosInstance.get<GetAdminPermissionsResponse>(ADMIN_PERMISSION_ENDPOINTS.LIST, { params });
  return response.data;
}
