import { axiosInstance } from '@shared/api/axios';
import type { BulkCreateBlockWordRequest, BulkCreateBlockWordResponse } from '../types/block-word.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function bulkCreateBlockWordApi(data: BulkCreateBlockWordRequest): Promise<BulkCreateBlockWordResponse> {
  const response = await axiosInstance.post<BulkCreateBlockWordResponse>(SECURITY_ENDPOINTS.BLOCK_WORD_BULK_CREATE, data);
  return response.data;
}
