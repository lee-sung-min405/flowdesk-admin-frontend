import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateAdminPermissionStatusRequest, UpdateAdminPermissionStatusResponse } from '../types/admin-permission.type';
import { updateAdminPermissionStatusApi } from '../api/update-admin-permission-status.api';

export function useUpdateAdminPermissionStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdminPermissionStatusResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateAdminPermissionStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateAdminPermissionStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
    },
  });
}
