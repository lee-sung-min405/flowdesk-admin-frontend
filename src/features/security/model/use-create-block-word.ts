import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateBlockWordRequest, CreateBlockWordResponse } from '../types/block-word.type';
import { createBlockWordApi } from '../api/create-block-word.api';

export function useCreateBlockWord() {
  const queryClient = useQueryClient();

  return useMutation<CreateBlockWordResponse, AxiosError<ErrorResponse>, CreateBlockWordRequest>({
    mutationFn: createBlockWordApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockWords'] });
    },
  });
}
