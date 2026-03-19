import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetAdminActionsRequest, GetAdminActionsResponse } from '../types/admin-action.type';
import { getAdminActionsApi } from '../api/get-admin-actions.api';

export function useAdminActions(params: GetAdminActionsRequest) {
  return useQuery<GetAdminActionsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['admin-actions', params],
    queryFn: () => getAdminActionsApi(params),
  });
}
