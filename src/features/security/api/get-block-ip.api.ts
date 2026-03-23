import { axiosInstance } from '@shared/api/axios';
import type { GetBlockIpResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function getBlockIpApi(id: number): Promise<GetBlockIpResponse> {
  const response = await axiosInstance.get<GetBlockIpResponse>(SECURITY_ENDPOINTS.BLOCK_IP_DETAIL(id));
  return response.data;
}
