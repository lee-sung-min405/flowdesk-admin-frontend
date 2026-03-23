import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateBlockIpRequest, UpdateBlockIpResponse } from '../types/block-ip.type';
import { updateBlockIpApi } from '../api/update-block-ip.api';

export function useUpdateBlockIp() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBlockIpResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateBlockIpRequest }
  >({
    mutationFn: ({ id, data }) => updateBlockIpApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockIps'] });
    },
  });
}
