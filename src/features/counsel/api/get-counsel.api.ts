import { axiosInstance } from '@shared/api/axios';
import type { GetCounselResponse } from '../types/counsel.type';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function getCounselApi(id: number): Promise<GetCounselResponse> {
  const response = await axiosInstance.get<GetCounselResponse>(COUNSEL_ENDPOINTS.DETAIL(id));
  return response.data;
}
