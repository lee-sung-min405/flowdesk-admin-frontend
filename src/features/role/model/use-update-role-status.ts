import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateRoleStatusRequest, UpdateRoleStatusResponse } from '../types/role.type';
import { updateRoleStatusApi } from '../api/update-role-status.api';

export function useUpdateRoleStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateRoleStatusResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateRoleStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateRoleStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
