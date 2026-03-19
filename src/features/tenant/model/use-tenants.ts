import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetTenantsRequest, GetTenantsResponse } from '../types/tenant.type';
import { getTenantsApi } from '../api/get-tenants.api';

export function useTenants(params: GetTenantsRequest) {
  return useQuery<GetTenantsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['tenants', params],
    queryFn: () => getTenantsApi(params),
  });
}
