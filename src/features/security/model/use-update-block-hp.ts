import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateBlockHpRequest, UpdateBlockHpResponse } from '../types/block-hp.type';
import { updateBlockHpApi } from '../api/update-block-hp.api';

export function useUpdateBlockHp() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBlockHpResponse,
    AxiosError<ErrorResponse>,
    { id: number; data: UpdateBlockHpRequest }
  >({
    mutationFn: ({ id, data }) => updateBlockHpApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockHps'] });
    },
  });
}
