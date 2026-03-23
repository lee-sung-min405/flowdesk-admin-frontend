import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { BulkCreateBlockWordRequest, BulkCreateBlockWordResponse } from '../types/block-word.type';
import { bulkCreateBlockWordApi } from '../api/bulk-create-block-word.api';

export function useBulkCreateBlockWord() {
  const queryClient = useQueryClient();

  return useMutation<BulkCreateBlockWordResponse, AxiosError<ErrorResponse>, BulkCreateBlockWordRequest>({
    mutationFn: bulkCreateBlockWordApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockWords'] });
    },
  });
}
