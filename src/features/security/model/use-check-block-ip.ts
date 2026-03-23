import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CheckBlockedResponse } from '../types/block-ip.type';
import { checkBlockIpApi } from '../api/check-block-ip.api';

export function useCheckBlockIp(ip: string) {
  return useQuery<CheckBlockedResponse, AxiosError<ErrorResponse>>({
    queryKey: ['checkBlockIp', ip],
    queryFn: () => checkBlockIpApi({ ip }),
    enabled: ip.length > 0,
  });
}
