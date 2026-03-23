import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateTenantStatusRequest, CreateTenantStatusResponse } from '../types/tenant-status.type';
import { createTenantStatusApi } from '../api/create-tenant-status.api';

export function useCreateTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation<CreateTenantStatusResponse, AxiosError<ErrorResponse>, CreateTenantStatusRequest>({
    mutationFn: createTenantStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-statuses'] });
    },
  });
}
