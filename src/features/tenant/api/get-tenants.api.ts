import { axiosInstance } from '@shared/api/axios';
import type { GetTenantsRequest, GetTenantsResponse } from '../types/tenant.type';
import { TENANT_ENDPOINTS } from './tenant.endpoint';

export async function getTenantsApi(params: GetTenantsRequest): Promise<GetTenantsResponse> {
  const response = await axiosInstance.get<GetTenantsResponse>(TENANT_ENDPOINTS.LIST, { params });
  return response.data;
}
