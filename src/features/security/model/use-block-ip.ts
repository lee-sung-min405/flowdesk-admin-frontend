import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetBlockIpResponse } from '../types/block-ip.type';
import { getBlockIpApi } from '../api/get-block-ip.api';

export function useBlockIp(id: number) {
  return useQuery<GetBlockIpResponse, AxiosError<ErrorResponse>>({
    queryKey: ['blockIps', id],
    queryFn: () => getBlockIpApi(id),
    enabled: id > 0,
  });
}
