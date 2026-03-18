import { axiosInstance } from '@shared/api/axios';
import type { GetUserResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function getUserApi(id: number): Promise<GetUserResponse> {
  const response = await axiosInstance.get<GetUserResponse>(USER_ENDPOINTS.DETAIL(id));
  return response.data;
}
