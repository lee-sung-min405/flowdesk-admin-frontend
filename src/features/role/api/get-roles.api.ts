import { axiosInstance } from '@shared/api/axios';
import type { GetRolesRequest, GetRolesResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function getRolesApi(params?: GetRolesRequest): Promise<GetRolesResponse> {
  const response = await axiosInstance.get<GetRolesResponse>(ROLE_ENDPOINTS.LIST, { params });
  return response.data;
}
