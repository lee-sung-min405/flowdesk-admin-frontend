import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetAdminPagesRequest, GetAdminPagesResponse } from '../types/admin-page.type';
import { getAdminPagesApi } from '../api/get-admin-pages.api';

export function useAdminPages(params: GetAdminPagesRequest, options?: { enabled?: boolean }) {
  return useQuery<GetAdminPagesResponse, AxiosError<ErrorResponse>>({
    queryKey: ['admin-pages', params],
    queryFn: () => getAdminPagesApi(params),
    enabled: options?.enabled,
  });
}
