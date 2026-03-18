import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateUserRequest, UpdateUserResponse } from '../types/user.type';
import { updateUserApi } from '../api/update-user.api';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateUserRequest }
  >({
    mutationFn: ({ id, data }) => updateUserApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
