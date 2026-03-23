import { axiosInstance } from '@shared/api/axios';
import type { GetTenantStatusesRequest, GetTenantStatusesResponse } from '../types/tenant-status.type';
import { TENANT_STATUS_ENDPOINTS } from './tenant-status.endpoint';

export async function getTenantStatusesApi(
  params: GetTenantStatusesRequest,
): Promise<GetTenantStatusesResponse> {
  const response = await axiosInstance.get<GetTenantStatusesResponse>(
    TENANT_STATUS_ENDPOINTS.LIST,
    { params },
  );
  return response.data;
}
