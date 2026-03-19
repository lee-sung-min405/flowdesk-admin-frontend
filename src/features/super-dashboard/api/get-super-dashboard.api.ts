import { axiosInstance } from '@shared/api/axios';
import type { SuperDashboardResponse } from '../types/super-dashboard.type';
import { SUPER_DASHBOARD_ENDPOINTS } from './super-dashboard.endpoint';

export async function getSuperDashboardApi(): Promise<SuperDashboardResponse> {
  const response = await axiosInstance.get<SuperDashboardResponse>(
    SUPER_DASHBOARD_ENDPOINTS.DASHBOARD,
  );
  return response.data;
}
