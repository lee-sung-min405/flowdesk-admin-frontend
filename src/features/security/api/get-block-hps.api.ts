import { axiosInstance } from '@shared/api/axios';
import type { GetBlockHpsRequest, GetBlockHpsResponse } from '../types/block-hp.type';
import { SECURITY_ENDPOINTS } from './security.endpoint';

export async function getBlockHpsApi(params: GetBlockHpsRequest): Promise<GetBlockHpsResponse> {
  const response = await axiosInstance.get<GetBlockHpsResponse>(SECURITY_ENDPOINTS.BLOCK_HP_LIST, { params });
  return response.data;
}
