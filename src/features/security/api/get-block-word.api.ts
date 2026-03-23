import { axiosInstance } from '@shared/api/axios';
import type { GetBlockWordResponse } from '../types/block-word.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function getBlockWordApi(id: number): Promise<GetBlockWordResponse> {
  const response = await axiosInstance.get<GetBlockWordResponse>(SECURITY_ENDPOINTS.BLOCK_WORD_DETAIL(id));
  return response.data;
}
