import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetTenantStatusResponse } from '../types/tenant-status.type';
import { getTenantStatusApi } from '../api/get-tenant-status.api';

export function useTenantStatus(id: number) {
  return useQuery<GetTenantStatusResponse, AxiosError<ErrorResponse>>({
    queryKey: ['tenant-status', id],
    queryFn: () => getTenantStatusApi(id),
    enabled: id > 0,
  });
}
