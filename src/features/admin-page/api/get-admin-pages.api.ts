import { axiosInstance } from '@shared/api/axios';
import type { GetAdminPagesRequest, GetAdminPagesResponse } from '../types/admin-page.type';
import { ADMIN_PAGE_ENDPOINTS } from './admin-page.endpoint';

export async function getAdminPagesApi(params: GetAdminPagesRequest): Promise<GetAdminPagesResponse> {
  const response = await axiosInstance.get<GetAdminPagesResponse>(ADMIN_PAGE_ENDPOINTS.LIST, { params });
  return response.data;
}
