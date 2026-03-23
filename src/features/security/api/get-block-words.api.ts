import { axiosInstance } from '@shared/api/axios';
import type { GetBlockWordsRequest, GetBlockWordsResponse } from '../types/block-word.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function getBlockWordsApi(params: GetBlockWordsRequest): Promise<GetBlockWordsResponse> {
  const response = await axiosInstance.get<GetBlockWordsResponse>(SECURITY_ENDPOINTS.BLOCK_WORD_LIST, { params });
  return response.data;
}
