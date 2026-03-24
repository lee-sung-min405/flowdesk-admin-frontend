import { axiosInstance } from '@shared/api/axios';
import type { GetCounselsRequest, GetCounselsResponse } from '../types/counsel.type';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function getCounselsApi(params: GetCounselsRequest): Promise<GetCounselsResponse> {
  const response = await axiosInstance.get<GetCounselsResponse>(COUNSEL_ENDPOINTS.LIST, { params });
  return response.data;
}
