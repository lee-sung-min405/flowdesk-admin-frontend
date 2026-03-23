import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateBoardTypeRequest, CreateBoardTypeResponse } from '../types/board-type.type';
import { createBoardTypeApi } from '../api/create-board-type.api';

export function useCreateBoardType() {
  const queryClient = useQueryClient();

  return useMutation<CreateBoardTypeResponse, AxiosError<ErrorResponse>, CreateBoardTypeRequest>({
    mutationFn: createBoardTypeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-types'] });
    },
  });
}
