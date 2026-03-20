import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { addUserToRoleApi, removeUserFromRoleApi } from '../api/update-role-users.api';

export function useAddUserToRole() {
  const queryClient = useQueryClient();

  return useMutation<
    { userSeq: number; assignedRoleIds: number[] },
    AxiosError<ErrorResponse>,
    { userSeq: number; roleId: number }
  >({
    mutationFn: ({ userSeq, roleId }) => addUserToRoleApi(userSeq, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useRemoveUserFromRole() {
  const queryClient = useQueryClient();

  return useMutation<
    { userSeq: number; assignedRoleIds: number[] },
    AxiosError<ErrorResponse>,
    { userSeq: number; roleId: number }
  >({
    mutationFn: ({ userSeq, roleId }) => removeUserFromRoleApi(userSeq, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
