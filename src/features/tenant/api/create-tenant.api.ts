import { axiosInstance } from '@shared/api/axios';
import type { CreateTenantRequest, CreateTenantResponse } from '../types/tenant.type';
import { TENANT_ENDPOINTS } from './tenant.endpoint';

export async function createTenantApi(data: CreateTenantRequest): Promise<CreateTenantResponse> {
  const response = await axiosInstance.post<CreateTenantResponse>(TENANT_ENDPOINTS.CREATE, data);
  return response.data;
}
