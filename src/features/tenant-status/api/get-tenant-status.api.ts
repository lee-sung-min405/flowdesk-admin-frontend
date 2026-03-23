import { axiosInstance } from '@shared/api/axios';
import type { GetTenantStatusResponse } from '../types/tenant-status.type';
import { TENANT_STATUS_ENDPOINTS } from './tenant-status.endpoint';

export async function getTenantStatusApi(id: number): Promise<GetTenantStatusResponse> {
  const response = await axiosInstance.get<GetTenantStatusResponse>(
    TENANT_STATUS_ENDPOINTS.DETAIL(id),
  );
  return response.data;
}
