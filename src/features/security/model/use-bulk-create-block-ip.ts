import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { BulkCreateBlockIpRequest, BulkCreateBlockIpResponse } from '../types/block-ip.type';
import { bulkCreateBlockIpApi } from '../api/bulk-create-block-ip.api';

export function useBulkCreateBlockIp() {
  const queryClient = useQueryClient();

  return useMutation<BulkCreateBlockIpResponse, AxiosError<ErrorResponse>, BulkCreateBlockIpRequest>({
    mutationFn: bulkCreateBlockIpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockIps'] });
    },
  });
}
