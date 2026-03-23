import { axiosInstance } from '@shared/api/axios';
import type { BulkCreateBlockIpRequest, BulkCreateBlockIpResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function bulkCreateBlockIpApi(data: BulkCreateBlockIpRequest): Promise<BulkCreateBlockIpResponse> {
  const response = await axiosInstance.post<BulkCreateBlockIpResponse>(SECURITY_ENDPOINTS.BLOCK_IP_BULK_CREATE, data);
  return response.data;
}
