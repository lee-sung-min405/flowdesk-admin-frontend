import { axiosInstance } from '@shared/api/axios';
import type { CreateAdminActionRequest, CreateAdminActionResponse } from '../types/admin-action.type';
import { ADMIN_ACTION_ENDPOINTS } from './admin-action.endpoint';

export async function createAdminActionApi(data: CreateAdminActionRequest): Promise<CreateAdminActionResponse> {
  const response = await axiosInstance.post<CreateAdminActionResponse>(ADMIN_ACTION_ENDPOINTS.CREATE, data);
  return response.data;
}
