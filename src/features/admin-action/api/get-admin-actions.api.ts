import { axiosInstance } from '@shared/api/axios';
import type { GetAdminActionsRequest, GetAdminActionsResponse } from '../types/admin-action.type';
import { ADMIN_ACTION_ENDPOINTS } from './admin-action.endpoint';

export async function getAdminActionsApi(params: GetAdminActionsRequest): Promise<GetAdminActionsResponse> {
  const response = await axiosInstance.get<GetAdminActionsResponse>(ADMIN_ACTION_ENDPOINTS.LIST, { params });
  return response.data;
}
