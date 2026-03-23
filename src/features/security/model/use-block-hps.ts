import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBlockHpsRequest, GetBlockHpsResponse } from '../types/block-hp.type';
import { getBlockHpsApi } from '../api/get-block-hps.api';

export function useBlockHps(params: GetBlockHpsRequest) {
  return useQuery<GetBlockHpsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['blockHps', params],
    queryFn: () => getBlockHpsApi(params),
  });
}
