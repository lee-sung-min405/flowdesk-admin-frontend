import { axiosInstance } from '@shared/api/axios';
import type { UpdateBlockIpRequest, UpdateBlockIpResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function updateBlockIpApi(id: number, data: UpdateBlockIpRequest): Promise<UpdateBlockIpResponse> {
  const response = await axiosInstance.patch<UpdateBlockIpResponse>(SECURITY_ENDPOINTS.BLOCK_IP_UPDATE(id), data);
  return response.data;
}
