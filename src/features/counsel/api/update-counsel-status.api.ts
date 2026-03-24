import { axiosInstance } from '@shared/api/axios';
import type { UpdateCounselStatusRequest } from '../types/counsel.type';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function updateCounselStatusApi(
  id: number,
  data: UpdateCounselStatusRequest,
): Promise<void> {
  await axiosInstance.patch(COUNSEL_ENDPOINTS.STATUS(id), data);
}
