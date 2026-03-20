import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CopyRolePermissionsRequest, CopyRolePermissionsResponse } from '../types/role.type';
import { copyRolePermissionsApi } from '../api/copy-role-permissions.api';

export function useCopyRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation<
    CopyRolePermissionsResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: CopyRolePermissionsRequest }
  >({
    mutationFn: ({ id, data }) => copyRolePermissionsApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
