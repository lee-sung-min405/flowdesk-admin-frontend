import { axiosInstance } from '@shared/api/axios';
import type {
  UpdateTenantStatusActiveRequest,
  UpdateTenantStatusActiveResponse,
} from '../types/tenant-status.type';
import { TENANT_STATUS_ENDPOINTS } from './tenant-status.endpoint';

export async function updateTenantStatusActiveApi(
  id: number,
  data: UpdateTenantStatusActiveRequest,
): Promise<UpdateTenantStatusActiveResponse> {
  const response = await axiosInstance.patch<UpdateTenantStatusActiveResponse>(
    TENANT_STATUS_ENDPOINTS.ACTIVE(id),
    data,
  );
  return response.data;
}
