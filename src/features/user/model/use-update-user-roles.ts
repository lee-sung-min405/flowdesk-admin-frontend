import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateUserRolesRequest, UpdateUserRolesResponse } from '../types/user.type';
import { updateUserRolesApi } from '../api/update-user-roles.api';

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserRolesResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateUserRolesRequest }
  >({
    mutationFn: ({ id, data }) => updateUserRolesApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
