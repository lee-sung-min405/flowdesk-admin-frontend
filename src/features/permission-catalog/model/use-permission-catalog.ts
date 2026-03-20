import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetPermissionCatalogResponse } from '../types/permission-catalog.type';
import { getPermissionCatalogApi } from '../api/get-permission-catalog.api';

export function usePermissionCatalog(options?: { enabled?: boolean }) {
  return useQuery<GetPermissionCatalogResponse, AxiosError<ErrorResponse>>({
    queryKey: ['permission-catalog'],
    queryFn: getPermissionCatalogApi,
    enabled: options?.enabled,
  });
}
