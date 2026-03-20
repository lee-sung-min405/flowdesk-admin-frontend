import { axiosInstance } from '@shared/api/axios';
import type { RoleDetailResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function getRoleApi(id: number): Promise<RoleDetailResponse> {
  const response = await axiosInstance.get<RoleDetailResponse>(ROLE_ENDPOINTS.DETAIL(id));
  return response.data;
}
