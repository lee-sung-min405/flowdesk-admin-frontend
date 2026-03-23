import { axiosInstance } from '@shared/api/axios';
import type { UpdateBlockWordRequest, UpdateBlockWordResponse } from '../types/block-word.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function updateBlockWordApi(id: number, data: UpdateBlockWordRequest): Promise<UpdateBlockWordResponse> {
  const response = await axiosInstance.patch<UpdateBlockWordResponse>(SECURITY_ENDPOINTS.BLOCK_WORD_UPDATE(id), data);
  return response.data;
}
