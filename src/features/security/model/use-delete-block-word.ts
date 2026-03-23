import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteBlockWordApi } from '../api/delete-block-word.api';

export function useDeleteBlockWord() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteBlockWordApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockWords'] });
    },
  });
}
