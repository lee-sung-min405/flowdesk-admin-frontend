import { axiosInstance } from '@shared/api/axios';
import type { UpdateRoleStatusRequest, UpdateRoleStatusResponse } from '../types/role.type';
import { ROLE_ENDPOINTS } from './role.endpoint';

export async function updateRoleStatusApi(id: number, data: UpdateRoleStatusRequest): Promise<UpdateRoleStatusResponse> {
  const response = await axiosInstance.patch<UpdateRoleStatusResponse>(ROLE_ENDPOINTS.STATUS(id), data);
  return response.data;
}
