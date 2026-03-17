import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/login.api';
import type { LoginRequest, LoginResponse } from '../types/auth.type';
import type { ErrorResponse } from '../../../shared/types/error-response.type';
import { authService } from './auth.service';

export function useLogin() {
  return useMutation<LoginResponse, ErrorResponse, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      await authService.loginSuccess(data);
    },
  });
}