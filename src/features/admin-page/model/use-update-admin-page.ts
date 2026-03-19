import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateAdminPageRequest, UpdateAdminPageResponse } from '../types/admin-page.type';
import { updateAdminPageApi } from '../api/update-admin-page.api';

export function useUpdateAdminPage() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdminPageResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateAdminPageRequest }
  >({
    mutationFn: ({ id, data }) => updateAdminPageApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] });
    },
  });
}
