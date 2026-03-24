import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetCounselsRequest, GetCounselsResponse } from '../types/counsel.type';
import { getCounselsApi } from '../api/get-counsels.api';

export function useCounsels(params: GetCounselsRequest) {
  return useQuery<GetCounselsResponse, AxiosError<ErrorResponse>>({
    queryKey: ['counsels', params],
    queryFn: () => getCounselsApi(params),
  });
}
