import { axiosInstance } from '@shared/api/axios';
import type { GetUsersRequest, GetUsersResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function getUsersApi(params: GetUsersRequest): Promise<GetUsersResponse> {
  const response = await axiosInstance.get<GetUsersResponse>(USER_ENDPOINTS.LIST, { params });
  return response.data;
}
