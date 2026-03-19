import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateAdminPageStatusRequest, UpdateAdminPageStatusResponse } from '../types/admin-page.type';
import { updateAdminPageStatusApi } from '../api/update-admin-page-status.api';

export function useUpdateAdminPageStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdminPageStatusResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateAdminPageStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateAdminPageStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    },
  });
}
