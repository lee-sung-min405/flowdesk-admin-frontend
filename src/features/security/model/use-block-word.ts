import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBlockWordResponse } from '../types/block-word.type';
import { getBlockWordApi } from '../api/get-block-word.api';

export function useBlockWord(id: number) {
  return useQuery<GetBlockWordResponse, AxiosError<ErrorResponse>>({
    queryKey: ['blockWords', id],
    queryFn: () => getBlockWordApi(id),
    enabled: id > 0,
  });
}
