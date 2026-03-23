import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { UpdateBoardTypeRequest, UpdateBoardTypeResponse } from '../types/board-type.type';
import { updateBoardTypeApi } from '../api/update-board-type.api';

export function useUpdateBoardType() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBoardTypeResponse,
    AxiosError<ErrorResponse>,
    { boardId: number; data: UpdateBoardTypeRequest }
  >({
    mutationFn: ({ boardId, data }) => updateBoardTypeApi(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-types'] });
    },
  });
}
