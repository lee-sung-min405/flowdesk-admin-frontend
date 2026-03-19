import { axiosInstance } from '@shared/api/axios';
import type { UpdateAdminPageStatusRequest, UpdateAdminPageStatusResponse } from '../types/admin-page.type';
import { ADMIN_PAGE_ENDPOINTS } from './admin-page.endpoint';

export async function updateAdminPageStatusApi(id: number, data: UpdateAdminPageStatusRequest): Promise<UpdateAdminPageStatusResponse> {
  const response = await axiosInstance.patch<UpdateAdminPageStatusResponse>(ADMIN_PAGE_ENDPOINTS.STATUS(id), data);
  return response.data;
}
