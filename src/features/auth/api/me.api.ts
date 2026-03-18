import { axiosInstance } from '@shared/api/axios';
import type { MeResponse } from '../types/auth.type';
import { AUTH_ENDPOINTS } from './endpoints';

export async function meApi(): Promise<MeResponse> {
	const response = await axiosInstance.get<MeResponse>(AUTH_ENDPOINTS.ME);
	return response.data;
}
