import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CreateBlockHpRequest, CreateBlockHpResponse } from '../types/block-hp.type';
import { createBlockHpApi } from '../api/create-block-hp.api';

export function useCreateBlockHp() {
  const queryClient = useQueryClient();

  return useMutation<CreateBlockHpResponse, AxiosError<ErrorResponse>, CreateBlockHpRequest>({
    mutationFn: createBlockHpApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockHps'] });
    },
  });
}
