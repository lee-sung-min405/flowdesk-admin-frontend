import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetUserResponse } from '../types/user.type';
import { getUserApi } from '../api/get-user.api';

export function useUser(id: number) {
  return useQuery<GetUserResponse, AxiosError<ErrorResponse>>({
    queryKey: ['users', id],
    queryFn: () => getUserApi(id),
    enabled: id > 0,
  });
}
