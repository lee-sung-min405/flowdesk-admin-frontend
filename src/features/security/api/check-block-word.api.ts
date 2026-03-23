import { axiosInstance } from '@shared/api/axios';
import type { CheckBlockWordRequest } from '../types/block-word.type';
import type { CheckBlockedResponse } from '../types/block-ip.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function checkBlockWordApi(params: CheckBlockWordRequest): Promise<CheckBlockedResponse> {
  const response = await axiosInstance.get<CheckBlockedResponse>(SECURITY_ENDPOINTS.BLOCK_WORD_CHECK, { params });
  return response.data;
}
