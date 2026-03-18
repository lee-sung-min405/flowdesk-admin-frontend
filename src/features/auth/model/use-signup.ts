import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { SignupRequest, SignupResponse } from '../types/auth.type';
import { signupApi } from '../api/signup.api';

export function useSignup() {
  return useMutation<SignupResponse, AxiosError<ErrorResponse>, SignupRequest>({
    mutationFn: signupApi,
  });
}
