import { axiosInstance } from '@shared/api/axios';
import type { UpdateTenantStatusRequest, UpdateTenantStatusResponse } from '../types/tenant-status.type';
import { TENANT_STATUS_ENDPOINTS } from './tenant-status.endpoint';

export async function updateTenantStatusApi(
  id: number,
  data: UpdateTenantStatusRequest,
): Promise<UpdateTenantStatusResponse> {
  const response = await axiosInstance.patch<UpdateTenantStatusResponse>(
    TENANT_STATUS_ENDPOINTS.UPDATE(id),
    data,
  );
  return response.data;
}
