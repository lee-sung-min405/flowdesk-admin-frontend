import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBlockWordsRequest, GetBlockWordsResponse } from '../types/block-word.type';
import { getBlockWordsApi } from '../api/get-block-words.api';

export function useBlockWords(params: GetBlockWordsRequest) {
  return useQuery<GetBlockWordsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['blockWords', params],
    queryFn: () => getBlockWordsApi(params),
  });
}
