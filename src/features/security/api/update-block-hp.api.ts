import { axiosInstance } from '@shared/api/axios';
import type { UpdateBlockHpRequest, UpdateBlockHpResponse } from '../types/block-hp.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function updateBlockHpApi(id: number, data: UpdateBlockHpRequest): Promise<UpdateBlockHpResponse> {
  const response = await axiosInstance.patch<UpdateBlockHpResponse>(SECURITY_ENDPOINTS.BLOCK_HP_UPDATE(id), data);
  return response.data;
}
