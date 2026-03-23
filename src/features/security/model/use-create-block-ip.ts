import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateBlockIpRequest, CreateBlockIpResponse } from '../types/block-ip.type';
import { createBlockIpApi } from '../api/create-block-ip.api';

export function useCreateBlockIp() {
  const queryClient = useQueryClient();

  return useMutation<CreateBlockIpResponse, AxiosError<ErrorResponse>, CreateBlockIpRequest>({
    mutationFn: createBlockIpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockIps'] });
    },
  });
}
