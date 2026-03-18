import { axiosInstance } from '@shared/api/axios';
import type { UpdateProfileRequest, UpdateProfileResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function updateProfileApi(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const response = await axiosInstance.patch<UpdateProfileResponse>(AUTH_ENDPOINTS.ME_PROFILE, data);
  return response.data;
}
