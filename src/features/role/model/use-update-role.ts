import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateRoleRequest, UpdateRoleResponse } from '../types/role.type';
import { updateRoleApi } from '../api/update-role.api';

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRoleResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateRoleRequest }
  >({
    mutationFn: ({ id, data }) => updateRoleApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
