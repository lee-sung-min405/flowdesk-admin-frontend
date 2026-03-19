import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { SuperDashboardResponse } from '../types/super-dashboard.type';
import { getSuperDashboardApi } from '../api/get-super-dashboard.api';

export function useSuperDashboard() {
  return useQuery<SuperDashboardResponse, AxiosError<ErrorResponse>>({
    queryKey: ['super-dashboard'],
    queryFn: () => getSuperDashboardApi(),
  });
}
