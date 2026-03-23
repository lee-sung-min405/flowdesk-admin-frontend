import { axiosInstance } from '@shared/api/axios';
import type { CreateBlockWordRequest, CreateBlockWordResponse } from '../types/block-word.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function createBlockWordApi(data: CreateBlockWordRequest): Promise<CreateBlockWordResponse> {
  const response = await axiosInstance.post<CreateBlockWordResponse>(SECURITY_ENDPOINTS.BLOCK_WORD_CREATE, data);
  return response.data;
}
