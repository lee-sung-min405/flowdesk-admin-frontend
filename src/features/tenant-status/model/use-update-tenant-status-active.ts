import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type {
  UpdateTenantStatusActiveRequest,
  UpdateTenantStatusActiveResponse,
} from '../types/tenant-status.type';
import { updateTenantStatusActiveApi } from '../api/update-tenant-status-active.api';

export function useUpdateTenantStatusActive() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTenantStatusActiveResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateTenantStatusActiveRequest }
  >({
    mutationFn: ({ id, data }) => updateTenantStatusActiveApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-statuses'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-status'] });
    },
  });
}
