import { axiosInstance } from '@shared/api/axios';
import type { CheckBlockIpRequest, CheckBlockedResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function checkBlockIpApi(params: CheckBlockIpRequest): Promise<CheckBlockedResponse> {
  const response = await axiosInstance.get<CheckBlockedResponse>(SECURITY_ENDPOINTS.BLOCK_IP_CHECK, { params });
  return response.data;
}
