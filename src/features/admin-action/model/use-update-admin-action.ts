import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateAdminActionRequest, UpdateAdminActionResponse } from '../types/admin-action.type';
import { updateAdminActionApi } from '../api/update-admin-action.api';

export function useUpdateAdminAction() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdminActionResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateAdminActionRequest }
  >({
    mutationFn: ({ id, data }) => updateAdminActionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-actions'] });
    },
  });
}
