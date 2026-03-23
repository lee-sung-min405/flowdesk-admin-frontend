import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteBlockHpApi } from '../api/delete-block-hp.api';

export function useDeleteBlockHp() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteBlockHpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockHps'] });
    },
  });
}
