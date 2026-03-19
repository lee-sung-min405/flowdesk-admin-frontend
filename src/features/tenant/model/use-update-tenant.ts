import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateTenantRequest, UpdateTenantResponse } from '../types/tenant.type';
import { updateTenantApi } from '../api/update-tenant.api';

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateTenantResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateTenantRequest }
  >({
    mutationFn: ({ id, data }) => updateTenantApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
