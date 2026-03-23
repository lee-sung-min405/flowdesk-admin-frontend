import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetTenantStatusesRequest, GetTenantStatusesResponse } from '../types/tenant-status.type';
import { getTenantStatusesApi } from '../api/get-tenant-statuses.api';

export function useTenantStatuses(params: GetTenantStatusesRequest) {
  return useQuery<GetTenantStatusesResponse, AxiosError<ErrorResponse>>({
    queryKey: ['tenant-statuses', params],
    queryFn: () => getTenantStatusesApi(params),
  });
}
