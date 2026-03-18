import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateUserRequest, CreateUserResponse } from '../types/user.type';
import { createUserApi } from '../api/create-user.api';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<CreateUserResponse, AxiosError<ErrorResponse>, CreateUserRequest>({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
