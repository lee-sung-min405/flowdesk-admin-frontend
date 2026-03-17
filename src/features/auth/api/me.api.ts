import { axiosInstance } from '../../../shared/api/axios';
import type { MeResponse } from '../types/auth.type';

export async function meApi(): Promise<MeResponse> {
	const response = await axiosInstance.get<MeResponse>('/auth/me');
	return response.data;
}
