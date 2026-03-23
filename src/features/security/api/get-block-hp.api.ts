import { axiosInstance } from '@shared/api/axios';
import type { GetBlockHpResponse } from '../types/block-hp.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function getBlockHpApi(id: number): Promise<GetBlockHpResponse> {
  const response = await axiosInstance.get<GetBlockHpResponse>(SECURITY_ENDPOINTS.BLOCK_HP_DETAIL(id));
  return response.data;
}
