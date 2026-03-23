import { axiosInstance } from '@shared/api/axios';
import type { CheckBlockHpRequest } from '../types/block-hp.type';
import type { CheckBlockedResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function checkBlockHpApi(params: CheckBlockHpRequest): Promise<CheckBlockedResponse> {
  const response = await axiosInstance.get<CheckBlockedResponse>(SECURITY_ENDPOINTS.BLOCK_HP_CHECK, { params });
  return response.data;
}
