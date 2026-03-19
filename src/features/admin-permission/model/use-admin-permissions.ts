import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetAdminPermissionsRequest, GetAdminPermissionsResponse } from '../types/admin-permission.type';
import { getAdminPermissionsApi } from '../api/get-admin-permissions.api';

export function useAdminPermissions(params: GetAdminPermissionsRequest) {
  return useQuery<GetAdminPermissionsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['admin-permissions', params],
    queryFn: () => getAdminPermissionsApi(params),
  });
}
