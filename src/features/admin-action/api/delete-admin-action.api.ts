import { axiosInstance } from '@shared/api/axios';
import { ADMIN_ACTION_ENDPOINTS } from './admin-action.endpoint';

export async function deleteAdminActionApi(id: number): Promise<void> {
  await axiosInstance.delete(ADMIN_ACTION_ENDPOINTS.DELETE(id));
}
