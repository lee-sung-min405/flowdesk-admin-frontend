import { axiosInstance } from '@shared/api/axios';
import type { BulkCreateBlockHpRequest, BulkCreateBlockHpResponse } from '../types/block-hp.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function bulkCreateBlockHpApi(data: BulkCreateBlockHpRequest): Promise<BulkCreateBlockHpResponse> {
  const response = await axiosInstance.post<BulkCreateBlockHpResponse>(SECURITY_ENDPOINTS.BLOCK_HP_BULK_CREATE, data);
  return response.data;
}
