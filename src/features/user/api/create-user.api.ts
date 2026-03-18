import { axiosInstance } from '@shared/api/axios';
import type { CreateUserRequest, CreateUserResponse } from '../types/user.type';
import { USER_ENDPOINTS } from './user.endpoint';

export async function createUserApi(data: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await axiosInstance.post<CreateUserResponse>(USER_ENDPOINTS.CREATE, data);
  return response.data;
}
