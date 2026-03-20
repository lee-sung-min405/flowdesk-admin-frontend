import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateRoleRequest, CreateRoleResponse } from '../types/role.type';
import { createRoleApi } from '../api/create-role.api';

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation<CreateRoleResponse, AxiosError<ErrorResponse>, CreateRoleRequest>({
    mutationFn: createRoleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
