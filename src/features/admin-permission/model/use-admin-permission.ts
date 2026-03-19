import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { AdminPermissionResponse } from '../types/admin-permission.type';
import { getAdminPermissionApi } from '../api/get-admin-permission.api';

export function useAdminPermission(id: number) {
  return useQuery<AdminPermissionResponse, AxiosError<ErrorResponse>>({
    queryKey: ['admin-permissions', id],
    queryFn: () => getAdminPermissionApi(id),
    enabled: id > 0,
  });
}
