import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBoardTypeResponse } from '../types/board-type.type';
import { getBoardTypeApi } from '../api/get-board-type.api';

export function useBoardType(boardId: number) {
  return useQuery<GetBoardTypeResponse, AxiosError<ErrorResponse>>({
    queryKey: ['board-types', boardId],
    queryFn: () => getBoardTypeApi(boardId),
    enabled: !!boardId,
  });
}
