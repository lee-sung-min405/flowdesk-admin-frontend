import { axiosInstance } from '@shared/api/axios';
import type { GetTenantResponse } from '../types/tenant.type';
import { TENANT_ENDPOINTS } from './tenant.endpoint';

export async function getTenantApi(id: number): Promise<GetTenantResponse> {
  const response = await axiosInstance.get<GetTenantResponse>(TENANT_ENDPOINTS.DETAIL(id));
  return response.data;
}
