import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateTenantRequest, CreateTenantResponse } from '../types/tenant.type';
import { createTenantApi } from '../api/create-tenant.api';

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation<CreateTenantResponse, AxiosError<ErrorResponse>, CreateTenantRequest>({
    mutationFn: createTenantApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
