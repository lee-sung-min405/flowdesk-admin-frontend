import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetCounselDashboardRequest, CounselDashboardResponse } from '../types/counsel.type';
import { getCounselDashboardApi } from '../api/get-counsel-dashboard.api';

export function useCounselDashboard(params?: GetCounselDashboardRequest) {
  return useQuery<CounselDashboardResponse, AxiosError<ErrorResponse>>({
    queryKey: ['counsel-dashboard', params?.startDate, params?.endDate],
    queryFn: () => getCounselDashboardApi(params),
  });
}
