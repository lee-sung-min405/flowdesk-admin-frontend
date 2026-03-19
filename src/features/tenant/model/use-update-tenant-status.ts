import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateTenantStatusRequest, UpdateTenantStatusResponse } from '../types/tenant.type';
import { updateTenantStatusApi } from '../api/update-tenant-status.api';

export function useUpdateTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTenantStatusResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateTenantStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateTenantStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
