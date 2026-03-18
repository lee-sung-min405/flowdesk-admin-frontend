import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { ResetUserPasswordRequest } from '../types/user.type';
import { resetUserPasswordApi } from '../api/reset-user-password.api';

export function useResetUserPassword() {
  return useMutation<
    void,
    AxiosError<ErrorResponse>,
    { id: number; data: ResetUserPasswordRequest }
  >({
    mutationFn: ({ id, data }) => resetUserPasswordApi(id, data),
  });
}
