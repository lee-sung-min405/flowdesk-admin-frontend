import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateAdminActionStatusRequest, UpdateAdminActionStatusResponse } from '../types/admin-action.type';
import { updateAdminActionStatusApi } from '../api/update-admin-action-status.api';

export function useUpdateAdminActionStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdminActionStatusResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateAdminActionStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateAdminActionStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-actions'] });
    },
  });
}
