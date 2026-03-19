import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateAdminPageRequest, CreateAdminPageResponse } from '../types/admin-page.type';
import { createAdminPageApi } from '../api/create-admin-page.api';

export function useCreateAdminPage() {
  const queryClient = useQueryClient();

  return useMutation<CreateAdminPageResponse, AxiosError<ErrorResponse>, CreateAdminPageRequest>({
    mutationFn: createAdminPageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    },
  });
}
