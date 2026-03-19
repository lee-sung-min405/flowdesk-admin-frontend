import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { AdminPageResponse } from '../types/admin-page.type';
import { getAdminPageApi } from '../api/get-admin-page.api';

export function useAdminPage(id: number) {
  return useQuery<AdminPageResponse, AxiosError<ErrorResponse>>({
    queryKey: ['admin-pages', id],
    queryFn: () => getAdminPageApi(id),
    enabled: id > 0,
  });
}
