import { axiosInstance } from '@shared/api/axios';
import type { UpdateAdminActionStatusRequest, UpdateAdminActionStatusResponse } from '../types/admin-action.type';
import { ADMIN_ACTION_ENDPOINTS } from './admin-action.endpoint';

export async function updateAdminActionStatusApi(id: number, data: UpdateAdminActionStatusRequest): Promise<UpdateAdminActionStatusResponse> {
  const response = await axiosInstance.patch<UpdateAdminActionStatusResponse>(ADMIN_ACTION_ENDPOINTS.STATUS(id), data);
  return response.data;
}
