import { axiosInstance } from '@shared/api/axios';
import type { UpdateCounselRequest, UpdateCounselResponse } from '../types/counsel.type';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function updateCounselApi(
  id: number,
  data: UpdateCounselRequest,
): Promise<UpdateCounselResponse> {
  const response = await axiosInstance.patch<UpdateCounselResponse>(COUNSEL_ENDPOINTS.UPDATE(id), data);
  return response.data;
}
