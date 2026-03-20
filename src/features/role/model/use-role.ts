import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { RoleDetailResponse } from '../types/role.type';
import { getRoleApi } from '../api/get-role.api';

export function useRole(id: number) {
  return useQuery<RoleDetailResponse, AxiosError<ErrorResponse>>({
    queryKey: ['roles', id],
    queryFn: () => getRoleApi(id),
    enabled: id > 0,
  });
}
