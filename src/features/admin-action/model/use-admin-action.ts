import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { AdminActionResponse } from '../types/admin-action.type';
import { getAdminActionApi } from '../api/get-admin-action.api';

export function useAdminAction(id: number) {
  return useQuery<AdminActionResponse, AxiosError<ErrorResponse>>({
    queryKey: ['admin-actions', id],
    queryFn: () => getAdminActionApi(id),
    enabled: id > 0,
  });
}
