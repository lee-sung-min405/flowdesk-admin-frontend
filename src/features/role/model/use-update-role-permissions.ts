import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateRolePermissionsRequest, UpdateRolePermissionsResponse } from '../types/role.type';
import { updateRolePermissionsApi } from '../api/update-role-permissions.api';

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRolePermissionsResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateRolePermissionsRequest }
  >({
    mutationFn: ({ id, data }) => updateRolePermissionsApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
