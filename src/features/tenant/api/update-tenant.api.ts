import { axiosInstance } from '@shared/api/axios';
import type { UpdateTenantRequest, UpdateTenantResponse } from '../types/tenant.type';
import { TENANT_ENDPOINTS } from './tenant.endpoint';

export async function updateTenantApi(id: number, data: UpdateTenantRequest): Promise<UpdateTenantResponse> {
  const response = await axiosInstance.patch<UpdateTenantResponse>(TENANT_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
