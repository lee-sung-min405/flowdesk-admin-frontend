import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@shared/types/error-response.type';
import type { GetWebsitesRequest, GetWebsitesResponse } from '../types/website.type';
import { getWebsitesApi } from '../api/get-websites.api';

export function useWebsites(params: GetWebsitesRequest) {
  return useQuery<GetWebsitesResponse, AxiosError<ErrorResponse>>({
    queryKey: ['websites', params],
    queryFn: () => getWebsitesApi(params),
  });
}
