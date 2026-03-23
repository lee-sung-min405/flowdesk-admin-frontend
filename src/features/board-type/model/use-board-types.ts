import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBoardTypesResponse } from '../types/board-type.type';
import { getBoardTypesApi } from '../api/get-board-types.api';

export function useBoardTypes() {
  return useQuery<GetBoardTypesResponse, AxiosError<ErrorResponse>>({
    queryKey: ['board-types'],
    queryFn: getBoardTypesApi,
  });
}
