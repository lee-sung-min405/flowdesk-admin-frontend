import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { ChangePasswordRequest } from '../types/auth.type';
import { changePasswordApi } from '../api/change-password.api';

export function useChangePassword() {
  return useMutation<void, AxiosError<ErrorResponse>, ChangePasswordRequest>({
    mutationFn: changePasswordApi,
  });
}
