import { axiosInstance } from '@shared/api/axios';
import type { CreateTenantStatusRequest, CreateTenantStatusResponse } from '../types/tenant-status.type';
import { TENANT_STATUS_ENDPOINTS } from './tenant-status.endpoint';

export async function createTenantStatusApi(
  data: CreateTenantStatusRequest,
): Promise<CreateTenantStatusResponse> {
  const response = await axiosInstance.post<CreateTenantStatusResponse>(
    TENANT_STATUS_ENDPOINTS.CREATE,
    data,
  );
  return response.data;
}
