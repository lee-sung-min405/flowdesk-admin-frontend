import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateAdminActionRequest, CreateAdminActionResponse } from '../types/admin-action.type';
import { createAdminActionApi } from '../api/create-admin-action.api';

export function useCreateAdminAction() {
  const queryClient = useQueryClient();

  return useMutation<CreateAdminActionResponse, AxiosError<ErrorResponse>, CreateAdminActionRequest>({
    mutationFn: createAdminActionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-actions'] });
    },
  });
}
