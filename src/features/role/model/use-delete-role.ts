import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteRoleApi } from '../api/delete-role.api';

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
