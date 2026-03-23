import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBlockIpsRequest, GetBlockIpsResponse } from '../types/block-ip.type';
import { getBlockIpsApi } from '../api/get-block-ips.api';

export function useBlockIps(params: GetBlockIpsRequest) {
  return useQuery<GetBlockIpsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['blockIps', params],
    queryFn: () => getBlockIpsApi(params),
  });
}
