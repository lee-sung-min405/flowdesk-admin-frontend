import { axiosInstance } from '@shared/api/axios';
import type { CreateBlockIpRequest, CreateBlockIpResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function createBlockIpApi(data: CreateBlockIpRequest): Promise<CreateBlockIpResponse> {
  const response = await axiosInstance.post<CreateBlockIpResponse>(SECURITY_ENDPOINTS.BLOCK_IP_CREATE, data);
  return response.data;
}
