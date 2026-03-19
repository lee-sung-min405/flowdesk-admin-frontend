import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteAdminActionApi } from '../api/delete-admin-action.api';

export function useDeleteAdminAction() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteAdminActionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-actions'] });
    },
  });
}
