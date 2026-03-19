import { axiosInstance } from '@shared/api/axios';
import type { UpdateTenantStatusRequest, UpdateTenantStatusResponse } from '../types/tenant.type';
import { TENANT_ENDPOINTS } from './tenant.endpoint';

export async function updateTenantStatusApi(id: number, data: UpdateTenantStatusRequest): Promise<UpdateTenantStatusResponse> {
  const response = await axiosInstance.patch<UpdateTenantStatusResponse>(TENANT_ENDPOINTS.STATUS(id), data);
  return response.data;
}
