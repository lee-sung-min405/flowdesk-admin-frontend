import { axiosInstance } from '@shared/api/axios';
import type { UpdateAdminPageRequest, UpdateAdminPageResponse } from '../types/admin-page.type';
import { ADMIN_PAGE_ENDPOINTS } from './admin-page.endpoint';

export async function updateAdminPageApi(id: number, data: UpdateAdminPageRequest): Promise<UpdateAdminPageResponse> {
  const response = await axiosInstance.patch<UpdateAdminPageResponse>(ADMIN_PAGE_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
