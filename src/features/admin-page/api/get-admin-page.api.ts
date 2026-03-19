import { axiosInstance } from '@shared/api/axios';
import type { AdminPageResponse } from '../types/admin-page.type';
import { ADMIN_PAGE_ENDPOINTS } from './admin-page.endpoint';

export async function getAdminPageApi(id: number): Promise<AdminPageResponse> {
  const response = await axiosInstance.get<AdminPageResponse>(ADMIN_PAGE_ENDPOINTS.DETAIL(id));
  return response.data;
}
