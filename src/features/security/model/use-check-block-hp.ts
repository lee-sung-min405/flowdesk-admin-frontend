import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CheckBlockedResponse } from '../types/block-ip.type';
import { checkBlockHpApi } from '../api/check-block-hp.api';

export function useCheckBlockHp(hp: string) {
  return useQuery<CheckBlockedResponse, AxiosError<ErrorResponse>>({
    queryKey: ['checkBlockHp', hp],
    queryFn: () => checkBlockHpApi({ hp }),
    enabled: hp.length > 0,
  });
}
