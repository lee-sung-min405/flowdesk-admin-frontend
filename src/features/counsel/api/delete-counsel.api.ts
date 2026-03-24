import { axiosInstance } from '@shared/api/axios';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function deleteCounselApi(id: number): Promise<void> {
  await axiosInstance.delete(COUNSEL_ENDPOINTS.DELETE(id));
}
