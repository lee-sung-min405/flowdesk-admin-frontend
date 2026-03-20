import { axiosInstance } from '@shared/api/axios';
import type { CopyRolePermissionsRequest, CopyRolePermissionsResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function copyRolePermissionsApi(id: number, data: CopyRolePermissionsRequest): Promise<CopyRolePermissionsResponse> {
  const response = await axiosInstance.put<CopyRolePermissionsResponse>(ROLE_ENDPOINTS.COPY_PERMISSIONS(id), data);
  return response.data;
}
