import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetTenantResponse } from '../types/tenant.type';
import { getTenantApi } from '../api/get-tenant.api';

export function useTenant(id: number) {
  return useQuery<GetTenantResponse, AxiosError<ErrorResponse>>({
    queryKey: ['tenants', id],
    queryFn: () => getTenantApi(id),
    enabled: id > 0,
  });
}
