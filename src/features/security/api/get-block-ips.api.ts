import { axiosInstance } from '@shared/api/axios';
import type { GetBlockIpsRequest, GetBlockIpsResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function getBlockIpsApi(params: GetBlockIpsRequest): Promise<GetBlockIpsResponse> {
  const response = await axiosInstance.get<GetBlockIpsResponse>(SECURITY_ENDPOINTS.BLOCK_IP_LIST, { params });
  return response.data;
}
