import { axiosInstance } from '@shared/api/axios';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function deleteRoleApi(id: number): Promise<void> {
  await axiosInstance.delete(ROLE_ENDPOINTS.DELETE(id));
}
