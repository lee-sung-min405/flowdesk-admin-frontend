import { axiosInstance } from '@shared/api/axios';
import type { CreateRoleRequest, CreateRoleResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function createRoleApi(data: CreateRoleRequest): Promise<CreateRoleResponse> {
  const response = await axiosInstance.post<CreateRoleResponse>(ROLE_ENDPOINTS.CREATE, data);
  return response.data;
}
