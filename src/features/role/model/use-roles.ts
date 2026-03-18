import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetRolesRequest, GetRolesResponse } from '../types/role.type';
import { getRolesApi } from '../api/get-roles.api';

export function useRoles(params?: GetRolesRequest) {
  return useQuery<GetRolesResponse, AxiosError<ErrorResponse>>({
    queryKey: ['roles', params],
    queryFn: () => getRolesApi(params),
  });
}
