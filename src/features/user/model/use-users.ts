import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetUsersRequest, GetUsersResponse } from '../types/user.type';
import { getUsersApi } from '../api/get-users.api';

export function useUsers(params: GetUsersRequest) {
  return useQuery<GetUsersResponse, AxiosError<ErrorResponse>>({
    queryKey: ['users', params],
    queryFn: () => getUsersApi(params),
  });
}
