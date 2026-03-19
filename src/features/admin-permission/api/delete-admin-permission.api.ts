import { axiosInstance } from '@shared/api/axios';
import { ADMIN_PERMISSION_ENDPOINTS } from './admin-permission.endpoint';

export async function deleteAdminPermissionApi(id: number): Promise<void> {
  await axiosInstance.delete(ADMIN_PERMISSION_ENDPOINTS.DELETE(id));
}
