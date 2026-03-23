import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateBlockWordRequest, UpdateBlockWordResponse } from '../types/block-word.type';
import { updateBlockWordApi } from '../api/update-block-word.api';

export function useUpdateBlockWord() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBlockWordResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateBlockWordRequest }
  >({
    mutationFn: ({ id, data }) => updateBlockWordApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockWords'] });
    },
  });
}
