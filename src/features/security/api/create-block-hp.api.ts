import { axiosInstance } from '@shared/api/axios';
import type { CreateBlockHpRequest, CreateBlockHpResponse } from '../types/block-hp.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function createBlockHpApi(data: CreateBlockHpRequest): Promise<CreateBlockHpResponse> {
  const response = await axiosInstance.post<CreateBlockHpResponse>(SECURITY_ENDPOINTS.BLOCK_HP_CREATE, data);
  return response.data;
}
