import { axiosInstance } from '@shared/api/axios';
import type { UpdateAdminActionRequest, UpdateAdminActionResponse } from '../types/admin-action.type';
import { ADMIN_ACTION_ENDPOINTS } from './admin-action.endpoint';

export async function updateAdminActionApi(id: number, data: UpdateAdminActionRequest): Promise<UpdateAdminActionResponse> {
  const response = await axiosInstance.patch<UpdateAdminActionResponse>(ADMIN_ACTION_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
