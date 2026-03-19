import { axiosInstance } from '@shared/api/axios';
import { TENANT_ENDPOINTS } from './tenant.endpoint';

export async function deleteTenantApi(id: number): Promise<void> {
  await axiosInstance.delete(TENANT_ENDPOINTS.DELETE(id));
}
