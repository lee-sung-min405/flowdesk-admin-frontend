import { axiosInstance } from '@shared/api/axios';
import type { CreateMemoRequest, CreateMemoResponse } from '../types/counsel.type';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function createCounselMemoApi(
  id: number,
  data: CreateMemoRequest,
): Promise<CreateMemoResponse> {
  const response = await axiosInstance.post<CreateMemoResponse>(COUNSEL_ENDPOINTS.MEMO(id), data);
  return response.data;
}
