import { axiosInstance } from '@shared/api/axios';
import { ADMIN_PAGE_ENDPOINTS } from './admin-page.endpoint';

export async function deleteAdminPageApi(id: number): Promise<void> {
  await axiosInstance.delete(ADMIN_PAGE_ENDPOINTS.DELETE(id));
}
