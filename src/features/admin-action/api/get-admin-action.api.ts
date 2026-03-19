import { axiosInstance } from '@shared/api/axios';
import type { AdminActionResponse } from '../types/admin-action.type';
import { ADMIN_ACTION_ENDPOINTS } from './admin-action.endpoint';

export async function getAdminActionApi(id: number): Promise<AdminActionResponse> {
  const response = await axiosInstance.get<AdminActionResponse>(ADMIN_ACTION_ENDPOINTS.DETAIL(id));
  return response.data;
}
