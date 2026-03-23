import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteTenantStatusApi } from '../api/delete-tenant-status.api';

export function useDeleteTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteTenantStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-statuses'] });
    },
  });
}
