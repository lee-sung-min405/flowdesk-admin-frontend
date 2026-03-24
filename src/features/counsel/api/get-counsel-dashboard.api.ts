import { axiosInstance } from '@shared/api/axios';
import type { GetCounselDashboardRequest, CounselDashboardResponse } from '../types/counsel.type';
import { COUNSEL_ENDPOINTS } from './counsel.endpoint';

export async function getCounselDashboardApi(
  params?: GetCounselDashboardRequest,
): Promise<CounselDashboardResponse> {
  const response = await axiosInstance.get<CounselDashboardResponse>(
    COUNSEL_ENDPOINTS.DASHBOARD,
    { params },
  );
  return response.data;
}
