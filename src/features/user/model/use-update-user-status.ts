import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateUserStatusRequest, UpdateUserStatusResponse } from '../types/user.type';
import { updateUserStatusApi } from '../api/update-user-status.api';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserStatusResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateUserStatusRequest }
  >({
    mutationFn: ({ id, data }) => updateUserStatusApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
