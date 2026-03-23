import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import { deleteBoardTypeApi } from '../api/delete-board-type.api';

export function useDeleteBoardType() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, number>({
    mutationFn: deleteBoardTypeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-types'] });
    },
  });
}
