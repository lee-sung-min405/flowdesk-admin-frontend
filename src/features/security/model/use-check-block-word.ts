import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { CheckBlockedResponse } from '../types/block-ip.type';
import { checkBlockWordApi } from '../api/check-block-word.api';

export function useCheckBlockWord(text: string) {
  return useQuery<CheckBlockedResponse, AxiosError<ErrorResponse>>({
    queryKey: ['checkBlockWord', text],
    queryFn: () => checkBlockWordApi({ text }),
    enabled: text.length > 0,
  });
}
