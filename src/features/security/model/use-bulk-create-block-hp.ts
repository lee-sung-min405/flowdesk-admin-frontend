import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { BulkCreateBlockHpRequest, BulkCreateBlockHpResponse } from '../types/block-hp.type';
import { bulkCreateBlockHpApi } from '../api/bulk-create-block-hp.api';

export function useBulkCreateBlockHp() {
  const queryClient = useQueryClient();

  return useMutation<BulkCreateBlockHpResponse, AxiosError<ErrorResponse>, BulkCreateBlockHpRequest>({
    mutationFn: bulkCreateBlockHpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockHps'] });
    },
  });
}
