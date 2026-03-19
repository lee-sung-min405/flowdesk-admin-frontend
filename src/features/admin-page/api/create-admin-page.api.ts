import { axiosInstance } from '@shared/api/axios';
import type { CreateAdminPageRequest, CreateAdminPageResponse } from '../types/admin-page.type';
import { ADMIN_PAGE_ENDPOINTS } from './admin-page.endpoint';

export async function createAdminPageApi(data: CreateAdminPageRequest): Promise<CreateAdminPageResponse> {
  const response = await axiosInstance.post<CreateAdminPageResponse>(ADMIN_PAGE_ENDPOINTS.CREATE, data);
  return response.data;
}
