import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBlockHpResponse } from '../types/block-hp.type';
import { getBlockHpApi } from '../api/get-block-hp.api';

export function useBlockHp(id: number) {
  return useQuery<GetBlockHpResponse, AxiosError<ErrorResponse>>({
    queryKey: ['blockHps', id],
    queryFn: () => getBlockHpApi(id),
    enabled: id > 0,
  });
}
