import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateAdminPermissionRequest, CreateAdminPermissionResponse } from '../types/admin-permission.type';
import { createAdminPermissionApi } from '../api/create-admin-permission.api';

export function useCreateAdminPermission() {
  const queryClient = useQueryClient();

  return useMutation<CreateAdminPermissionResponse, AxiosError<ErrorResponse>, CreateAdminPermissionRequest>({
    mutationFn: createAdminPermissionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
    },
  });
}
