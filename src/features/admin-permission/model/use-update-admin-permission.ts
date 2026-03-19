import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateAdminPermissionRequest, UpdateAdminPermissionResponse } from '../types/admin-permission.type';
import { updateAdminPermissionApi } from '../api/update-admin-permission.api';

export function useUpdateAdminPermission() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdminPermissionResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateAdminPermissionRequest }
  >({
    mutationFn: ({ id, data }) => updateAdminPermissionApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
    },
  });
}
