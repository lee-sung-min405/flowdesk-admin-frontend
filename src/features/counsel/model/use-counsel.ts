import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetCounselResponse } from '../types/counsel.type';
import { getCounselApi } from '../api/get-counsel.api';

export function useCounsel(id: number) {
  return useQuery<GetCounselResponse, AxiosError<ErrorResponse>>({
    queryKey: ['counsels', id],
    queryFn: () => getCounselApi(id),
    enabled: !!id,
  });
}
