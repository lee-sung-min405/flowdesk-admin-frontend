import { axiosInstance } from '@shared/api/axios';
import { TENANT_STATUS_ENDPOINTS } from './tenant-status.endpoint';

export async function deleteTenantStatusApi(id: number): Promise<void> {
  await axiosInstance.delete(TENANT_STATUS_ENDPOINTS.DELETE(id));
}
