import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteBlockIpApi } from '../api/delete-block-ip.api';

export function useDeleteBlockIp() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteBlockIpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockIps'] });
    },
  });
}
